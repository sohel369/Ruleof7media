CREATE TABLE IF NOT EXISTS affiliates (
    code VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'Starter',
    territory VARCHAR(255),
    country VARCHAR(255),
    audience_size VARCHAR(255),
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    assigned_leads_count INTEGER DEFAULT 0
);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_affiliate_id VARCHAR(255) REFERENCES affiliates(code);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS extra_data JSONB DEFAULT '{}'::jsonb;

-- Add lat and lon for geocoding to affiliates
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS lat DECIMAL(10,8);
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS lon DECIMAL(11,8);

-- IP & Location Verification Columns
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS ip_address VARCHAR(100);
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS ip_country VARCHAR(100);
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS ip_city VARCHAR(100);
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS is_mismatch BOOLEAN DEFAULT FALSE;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS mismatch_alert TEXT;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip_address VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip_country VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip_city VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_mismatch BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mismatch_alert TEXT;
