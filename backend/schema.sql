-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Wrapping Shops
CREATE TABLE wrapping_shops (
    shop_id SERIAL PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    central_base_lat DECIMAL(10,8) NOT NULL,
    central_base_lon DECIMAL(11,8) NOT NULL,
    radius_miles INTEGER DEFAULT 30,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Leads (Client Contacts)
CREATE TABLE leads (
    lead_id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES wrapping_shops(shop_id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    client_business_name VARCHAR(255),
    client_address TEXT,
    client_lat DECIMAL(10,8),
    client_lon DECIMAL(11,8),
    domain VARCHAR(255),                    -- e.g., 'acme.com'
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimed_at TIMESTAMP,
    UNIQUE(shop_id, client_email)           -- Exclusivity per shop + email
);

-- 3. Lead Claims Audit
CREATE TABLE lead_claims (
    claim_id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(lead_id) ON DELETE CASCADE,
    shop_id INTEGER REFERENCES wrapping_shops(shop_id),
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    distance_miles DECIMAL(8,2)
);

-- 4. Multi-Outlet Clients
CREATE TABLE client_outlets (
    outlet_id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(lead_id) ON DELETE CASCADE,
    outlet_address TEXT,
    outlet_lat DECIMAL(10,8),
    outlet_lon DECIMAL(11,8),
    assigned_shop_id INTEGER REFERENCES wrapping_shops(shop_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_leads_email ON leads(client_email);
CREATE INDEX idx_leads_domain ON leads(domain);
CREATE INDEX idx_leads_location ON leads USING GIST (ST_SetSRID(ST_MakePoint(client_lon, client_lat), 4326));
CREATE INDEX idx_shops_location ON wrapping_shops USING GIST (ST_SetSRID(ST_MakePoint(central_base_lon, central_base_lat), 4326));

-- Function: Calculate distance (Haversine)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL, lon1 DECIMAL,
    lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    RETURN (3958.8 * acos(
        least(1.0, 
            cos(radians(lat1)) * cos(radians(lat2)) * 
            cos(radians(lon2 - lon1)) + 
            sin(radians(lat1)) * sin(radians(lat2))
        )
    ));
END;
$$ LANGUAGE plpgsql;

-- Function: Check if within territory
CREATE OR REPLACE FUNCTION is_within_territory(
    p_shop_id INTEGER,
    p_client_lat DECIMAL,
    p_client_lon DECIMAL
) RETURNS TABLE (
    is_within BOOLEAN,
    distance_miles DECIMAL
) AS $$
DECLARE
    shop_lat DECIMAL;
    shop_lon DECIMAL;
    shop_radius INTEGER;
BEGIN
    SELECT central_base_lat, central_base_lon, radius_miles 
    INTO shop_lat, shop_lon, shop_radius
    FROM wrapping_shops WHERE shop_id = p_shop_id;

    SELECT 
        calculate_distance(shop_lat, shop_lon, p_client_lat, p_client_lon) <= shop_radius,
        calculate_distance(shop_lat, shop_lon, p_client_lat, p_client_lon)
    INTO is_within, distance_miles;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
