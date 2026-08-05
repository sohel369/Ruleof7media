require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const db = require('./db');
const { calculateScore } = require('./scoring');
const { sendEmail } = require('./mailer');
const { geocodeAddress } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
async function initServer() {
  await db.connectDb();

// Auto-create necessary tables from schema files
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.query(schemaSql);
    console.log('Executed schema.sql successfully.');
    
    const schemaUpdateSql = fs.readFileSync(path.join(__dirname, 'schema-update.sql'), 'utf8');
    await db.query(schemaUpdateSql);
    console.log('Executed schema-update.sql successfully.');
  } catch (err) {
    console.error('Error creating database tables from schema files:', err);
  }
}

initServer();

// Socket.io Events
io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

// REST API Endpoints

// 1. GET Leads
app.get('/api/leads', async (req, res) => {
  try {
    const { refId, assignedAffiliateId, stage, industry, search } = req.query;
    const result = await db.query('SELECT * FROM leads');
      let leads = result.rows.map(row => ({
        ...(row.extra_data || {}),
        ...row,
        name: row.client_name || row.name,
        email: row.client_email || row.email,
        company: row.client_business_name || row.company,
        assignedAffiliateId: row.assigned_affiliate_id,
        refId: row.ref_id,
        leadId: row.legacy_lead_id || row.lead_id
      }));
    
    // Filtering
    if (refId) {
      leads = leads.filter(l => l.refId === refId);
    }
    if (assignedAffiliateId) {
      leads = leads.filter(l => l.assignedAffiliateId === assignedAffiliateId);
    }
    if (stage) {
      leads = leads.filter(l => l.stage === stage);
    }
    if (industry) {
      leads = leads.filter(l => l.industry === industry);
    }
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l => 
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q))
      );
    }
    
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET Lead by ID (includes breakdown details)
app.get('/api/leads/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM leads WHERE lead_id = $1', [req.params.id]);
    const lead = result.rows[0];
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    // Add dynamic live breakdown just in case
    const scored = calculateScore(lead);
    const leadWithBreakdown = {
      ...lead,
      score: scored.score,
      stage: scored.stage,
      breakdown: scored.breakdown
    };
    
    res.json(leadWithBreakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST Save Funnel Step (Progressive Data Capture)
  app.post('/api/leads/step', async (req, res) => {
    try {
      const { leadId, step, data } = req.body;
      
      // Save or update data into PostgreSQL for all steps
      if (data.name && data.email) {
         let assigned_affiliate_id = data.refId || data.ref || null;
         
         // Validate assigned_affiliate_id exists
         if (assigned_affiliate_id) {
             const affiliateCheck = await db.query(`SELECT code FROM affiliates WHERE code = $1`, [assigned_affiliate_id]);
             if (affiliateCheck.rows.length === 0) {
                 assigned_affiliate_id = null; // Reset to null if affiliate does not exist
             }
         }

         let client_lat = null;
         let client_lon = null;
         let domain = data.email.split('@')[1];

         if (step === 1) {
            // Only geocode on step 1 to save API calls
            if (data.state && data.country) {
               const coords = await geocodeAddress(`${data.state}, ${data.country}`);
               if (coords) { 
                 client_lat = coords.lat; 
                 client_lon = coords.lon; 
               }
            }

            // Exclusivity and Proximity Routing
            if (!assigned_affiliate_id) {
                // Check exact email match
                const emailCheck = await db.query(`SELECT assigned_affiliate_id FROM leads WHERE client_email = $1 AND assigned_affiliate_id IS NOT NULL LIMIT 1`, [data.email]);
                if (emailCheck.rows.length > 0) {
                    assigned_affiliate_id = emailCheck.rows[0].assigned_affiliate_id;
                } else {
                    // Check domain match
                    const domainCheck = await db.query(`SELECT assigned_affiliate_id FROM leads WHERE domain = $1 AND assigned_affiliate_id IS NOT NULL LIMIT 1`, [domain]);
                    if (domainCheck.rows.length > 0) {
                        assigned_affiliate_id = domainCheck.rows[0].assigned_affiliate_id;
                    } else if (client_lat !== null && client_lon !== null) {
                        // Proximity check (30-mile radius, closest wins)
                        const closestAffiliate = await db.query(`
                            SELECT code, calculate_distance(lat, lon, $1, $2) as distance_miles
                            FROM affiliates
                            WHERE lat IS NOT NULL AND lon IS NOT NULL
                              AND calculate_distance(lat, lon, $1, $2) <= 30
                            ORDER BY distance_miles ASC
                            LIMIT 1
                        `, [client_lat, client_lon]);
                        if (closestAffiliate.rows.length > 0) {
                            assigned_affiliate_id = closestAffiliate.rows[0].code;
                        }
                    }
                }
            }
         }

         const extraData = JSON.stringify(data);
         await db.query(
           `INSERT INTO leads (legacy_lead_id, client_name, client_email, client_business_name, assigned_affiliate_id, ref_id, extra_data, client_lat, client_lon, domain)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (legacy_lead_id) DO UPDATE SET 
              client_name = EXCLUDED.client_name, 
              client_email = EXCLUDED.client_email, 
              client_business_name = EXCLUDED.client_business_name,
              assigned_affiliate_id = COALESCE(leads.assigned_affiliate_id, EXCLUDED.assigned_affiliate_id),
              ref_id = EXCLUDED.ref_id,
              extra_data = EXCLUDED.extra_data,
              domain = COALESCE(leads.domain, EXCLUDED.domain)`,
           [leadId, data.name, data.email, data.company || '', assigned_affiliate_id, data.refId || data.ref || null, extraData, client_lat, client_lon, domain]
         );
      }

      // Send Gmail Notification on completion (Step 7)
      if (step === 7 && data.name && data.email) {
         const leadRow = await db.query(`SELECT assigned_affiliate_id FROM leads WHERE legacy_lead_id = $1`, [leadId]);
         const partnerCode = leadRow.rows[0]?.assigned_affiliate_id;
         if (partnerCode) {
            const partnerRow = await db.query(`SELECT email, name FROM affiliates WHERE code = $1`, [partnerCode]);
            if (partnerRow.rows.length > 0) {
                const partnerEmail = partnerRow.rows[0].email;
                const html = `
                  <h2>New Qualified Lead</h2>
                  <p><strong>Name:</strong> ${data.name}</p>
                  <p><strong>Email:</strong> ${data.email}</p>
                  <p><strong>Company:</strong> ${data.company}</p>
                  <p><strong>Score:</strong> 100 / Hot</p>
                  <p>Login to your Partner Portal to view full details.</p>
                `;
                await sendEmail(partnerEmail, 'New Lead Assigned: ' + data.name, html);
            }
         }
      }

    res.json({
      success: true,
      message: "Funnel step saved.",
      score: 50,
      stage: 'Warm'
    });
  } catch (err) {
    console.error('Error saving funnel step:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. POST Route Lead (Assign to Affiliate)
app.post('/api/leads/route', async (req, res) => {
  try {
    const { leadId, affiliateCode } = req.body;
    res.json({ success: true, message: "Manual routing is temporarily disabled during PostgreSQL migration." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. POST Webhook Simulation
app.post('/api/webhooks/simulate', async (req, res) => {
  try {
    const { webhookUrl, payload } = req.body;
    console.log(`[Webhook Simulation] Posting to URL: ${webhookUrl}`);
    console.log(`[Webhook Simulation] Payload:`, JSON.stringify(payload, null, 2));

    // Simulate 200ms API latency
    await new Promise(resolve => setTimeout(resolve, 200));

    res.json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: 'Simulated Webhook Delivered successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. GET Affiliates
app.get('/api/affiliates', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM affiliates');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. GET Single Affiliate Details
app.get('/api/affiliates/:code', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM affiliates WHERE code = $1', [req.params.code]);
    const affiliate = result.rows[0];
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    res.json(affiliate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. POST Affiliate Application
app.post('/api/affiliates/apply', async (req, res) => {
  try {
    const { name, company, email, website, territory, country, audienceSize, tier } = req.body;
    
    // Generate a simple unique referral code based on company name
    const code = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingResult = await db.query('SELECT * FROM affiliates WHERE code = $1', [code]);
      if (existingResult.rows.length > 0) {
        return res.status(400).json({ error: 'A partner with this company name already exists.' });
      }
      
      let lat = null;
      let lon = null;
      if (territory && territory !== 'Global') {
        const searchQuery = country !== 'Global' ? `${territory}, ${country}` : territory;
        const coords = await geocodeAddress(searchQuery);
        if (coords) {
          lat = coords.lat;
          lon = coords.lon;
        }
      }

      const insertResult = await db.query(
        `INSERT INTO affiliates (code, name, company, email, website, territory, country, audience_size, tier, lat, lon)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [code, name, company, email, website || '', territory || 'Global', country || 'Global', audienceSize || '< 1,000', tier || 'Starter', lat, lon]
      );
      const newAffiliate = insertResult.rows[0];

    // Notify CRM Admin of new affiliate application
    io.emit('new_lead', {
      event: 'partner_application',
      code: newAffiliate.code,
      name: newAffiliate.name,
      company: newAffiliate.company,
      email: newAffiliate.email,
      timestamp: new Date()
    });

    res.json({ success: true, affiliate: newAffiliate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. POST Log Affiliate Clicks
app.post('/api/affiliates/click', async (req, res) => {
  try {
    const { code } = req.body;
    const result = await db.query('UPDATE affiliates SET clicks = clicks + 1 WHERE code = $1 RETURNING *', [code]);
    const affiliate = result.rows[0];
    
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    // Broadcast real-time click tracking event
    io.emit('scan_event', {
      type: 'link_click',
      partnerCode: code,
      partnerCompany: affiliate.company,
      message: `Click registered on referral code: ${code}`,
      timestamp: new Date()
    });

    res.json({ success: true, clicks: affiliate.clicks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9b. POST Affiliate Login (Partner Dashboard Access)
app.post('/api/affiliates/login', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Partner code is required' });
    }
    const result = await db.query('SELECT * FROM affiliates WHERE code = $1', [code.toLowerCase().trim()]);
    const affiliate = result.rows[0];
    if (!affiliate) {
      return res.status(404).json({ error: 'Partner code not found.' });
    }
    res.json({ success: true, affiliate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 0. POST Register Shop
app.post('/api/shops', async (req, res) => {
  try {
    const { business_name, central_base_lat, central_base_lon, contact_email, radius_miles } = req.body;
    const result = await db.query(
      `INSERT INTO wrapping_shops (business_name, central_base_lat, central_base_lon, contact_email, radius_miles) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [business_name, central_base_lat, central_base_lon, contact_email, radius_miles || 30]
    );
    res.json({ success: true, shop: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 0.5 POST Claim a Lead (Territory & Exclusivity Logic)
app.post('/api/leads/claim', async (req, res) => {
  try {
    const { shop_id, client_name, client_email, client_lat, client_lon, domain } = req.body;
    
    // 1. Check territory using PostGIS function
    const territoryCheck = await db.query(
      `SELECT * FROM is_within_territory($1, $2, $3)`,
      [shop_id, client_lat, client_lon]
    );
    
    const territoryResult = territoryCheck.rows[0];
    if (!territoryResult || !territoryResult.is_within) {
      return res.status(403).json({ 
        error: "This potential client is located outside your 30-mile exclusive territory.",
        distance_miles: territoryResult ? territoryResult.distance_miles : null
      });
    }

    // 2. Check for duplicate exact email (hard exclusivity)
    const emailCheck = await db.query(`SELECT shop_id FROM leads WHERE client_email = $1`, [client_email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: "This email address has already been claimed by another participating wrapping shop."
      });
    }
    
    // 3. Domain soft-check
    let domainWarning = null;
    if (domain) {
      const domainCheck = await db.query(`SELECT shop_id FROM leads WHERE domain = $1 LIMIT 1`, [domain]);
      if (domainCheck.rows.length > 0 && domainCheck.rows[0].shop_id !== shop_id) {
        domainWarning = "Note: This company domain is already active in another territory.";
      }
    }

    // 4. Insert lead
    const leadInsert = await db.query(
      `INSERT INTO leads (shop_id, client_name, client_email, client_lat, client_lon, domain, claimed_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING lead_id`,
      [shop_id, client_name, client_email, client_lat, client_lon, domain]
    );
    const newLeadId = leadInsert.rows[0].lead_id;

    // 5. Audit Log
    await db.query(
      `INSERT INTO lead_claims (lead_id, shop_id, distance_miles) VALUES ($1, $2, $3)`,
      [newLeadId, shop_id, territoryResult.distance_miles]
    );

    res.json({ 
      success: true, 
      message: "Lead claimed successfully!", 
      lead_id: newLeadId,
      warning: domainWarning 
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: "Lead already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// 0.6 GET Available Leads (within 30 miles, unclaimed by the shop)
app.get('/api/leads/available', async (req, res) => {
  try {
    const { shop_id } = req.query;
    if (!shop_id) return res.status(400).json({ error: "shop_id is required" });
    
    // Get shop coordinates
    const shopResult = await db.query(`SELECT central_base_lat, central_base_lon, radius_miles FROM wrapping_shops WHERE shop_id = $1`, [shop_id]);
    if (shopResult.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
    
    const shop = shopResult.rows[0];
    
    // Find leads within radius that are NOT claimed by this shop.
    // In a real scenario, this might be a pool of leads, but since leads are inserted WITH a shop_id, 
    // maybe we just return leads from the system that are near but belong to no one? 
    // Actually, according to the buyer, shops submit their own leads, so this API might be for leads that came from a central landing page.
    // For now, we will return leads that have no shop_id (if we allow that) or just all leads in territory.
    const availableLeads = await db.query(
      `SELECT l.*, calculate_distance($1, $2, l.client_lat, l.client_lon) as distance_miles
       FROM leads l
       WHERE calculate_distance($1, $2, l.client_lat, l.client_lon) <= $3`,
      [shop.central_base_lat, shop.central_base_lon, shop.radius_miles]
    );
    
    res.json({ success: true, leads: availableLeads.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 0.7 POST Claim an Outlet for an existing Client Lead (Phase 2 feature)
app.post('/api/leads/outlet', async (req, res) => {
  try {
    const { shop_id, lead_id, outlet_address, outlet_lat, outlet_lon } = req.body;
    
    // 1. Check territory using PostGIS function
    const territoryCheck = await db.query(
      `SELECT * FROM is_within_territory($1, $2, $3)`,
      [shop_id, outlet_lat, outlet_lon]
    );
    
    const territoryResult = territoryCheck.rows[0];
    if (!territoryResult || !territoryResult.is_within) {
      return res.status(403).json({ 
        error: "This outlet is located outside your 30-mile exclusive territory.",
        distance_miles: territoryResult ? territoryResult.distance_miles : null
      });
    }

    // 2. Insert outlet
    const outletInsert = await db.query(
      `INSERT INTO client_outlets (lead_id, assigned_shop_id, outlet_address, outlet_lat, outlet_lon)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [lead_id, shop_id, outlet_address, outlet_lat, outlet_lon]
    );

    res.json({ 
      success: true, 
      message: "Outlet claimed successfully!", 
      outlet: outletInsert.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. POST Simulate Wrap Scan (QR simulation)
app.post('/api/leads/simulate-scan', async (req, res) => {
  try {
    const { code, lat, lng } = req.body;
    
    const result = await db.query('SELECT * FROM affiliates WHERE code = $1', [code]);
    const affiliate = result.rows[0];
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate partner not found' });
    }

    // Log the click for the affiliate
    await db.query('UPDATE affiliates SET clicks = clicks + 1 WHERE code = $1', [code]);

    const locations = ['Sydney CBD', 'Parramatta', 'Manly Beach', 'Bondi Junction', 'Naperville Route 59', 'Chicago Downtown', 'Loop District'];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];

    const scanData = {
      type: 'qr_scan',
      partnerCode: code,
      partnerCompany: affiliate.company,
      location: randomLoc,
      message: `QR code scanned on ${affiliate.company} vehicle wrap in ${randomLoc}!`,
      timestamp: new Date()
    };

    // Broadcast scan event
    io.emit('scan_event', scanData);

    res.json({
      success: true,
      message: 'Simulated QR Scan event broadcasted successfully!',
      scan: scanData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. POST Create Stripe PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, planName } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: currency || 'usd',
      metadata: { planName },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Database Info Status
app.get('/api/db-status', (req, res) => {
  res.json(db.getDbState());
});

// Short URL Redirection for Print/Offline publishers (Magazines, Newspapers, QR Codes)
app.get('/r/:code', async (req, res) => {
  const code = req.params.code ? req.params.code.toLowerCase().trim() : '';
  try {
    const result = await db.query('UPDATE affiliates SET clicks = clicks + 1 WHERE code = $1 RETURNING *', [code]);
    const affiliate = result.rows[0];
    
    if (affiliate) {
      // Broadcast real-time click tracking event
      io.emit('scan_event', {
        type: 'link_click',
        partnerCode: code,
        partnerCompany: affiliate.company,
        message: `Offline Print/QR code scanned on referral: ${code}`,
        timestamp: new Date()
      });
    }
  } catch (err) {
    console.error('Error logging short URL click:', err);
  }
  res.redirect(`/funnel?ref=${code}`);
});

// Redirects to support training and landing referral link conventions requested by the buyer
app.get('/landing.html', (req, res) => {
  const ref = req.query.ref || '';
  res.redirect(`/funnel?ref=${ref}`);
});

app.get('/training/video-1.html', (req, res) => {
  const ref = req.query.ref || '';
  res.redirect(`/funnel/video-1?ref=${ref}`);
});

app.get('/affiliate-assets.html', (req, res) => {
  res.redirect('/affiliate/assets');
});

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Anything that doesn't match an API route, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
server.listen(PORT, () => {
  console.log(`Rule7Media Backend running on port ${PORT}`);
});

