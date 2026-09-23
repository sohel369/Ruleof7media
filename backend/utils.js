const axios = require('axios');

/**
 * Geocodes a location string using OpenStreetMap Nominatim API
 * @param {string} address - The location string to geocode (e.g. "Sydney, Australia")
 * @returns {Promise<{lat: number, lon: number}|null>}
 */
const geocodeAddress = async (address) => {
  try {
    if (!address) return null;
    
    // Clean address
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Rule7Media-App/1.0'
      },
      timeout: 5000
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error for address "${address}":`, error.message);
    return null;
  }
};

/**
 * Resolves an incoming request IP to geographical country & city
 * @param {string} ip - Client IP
 * @returns {Promise<{ip: string, country: string, countryCode: string, city: string, isLocal: boolean}>}
 */
const getIpGeoLocation = async (ip) => {
  try {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return { ip: ip || '127.0.0.1', country: 'Localhost (Dev)', countryCode: 'LOCAL', city: 'Development Network', isLocal: true };
    }

    const cleanIp = ip.replace(/^::ffff:/, '').trim();
    const res = await axios.get(`http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,regionName,city,query`, {
      timeout: 3000
    });

    if (res.data && res.data.status === 'success') {
      return {
        ip: res.data.query,
        country: res.data.country,
        countryCode: res.data.countryCode,
        city: res.data.city,
        region: res.data.regionName,
        isLocal: false
      };
    }
    return { ip: cleanIp, country: 'Unknown', countryCode: 'UNK', city: 'Unknown', isLocal: false };
  } catch (err) {
    return { ip: ip || 'Unknown', country: 'Unknown', countryCode: 'UNK', city: 'Unknown', isLocal: false };
  }
};

/**
 * Checks if the user-entered country/territory conflicts with their actual IP country
 * @param {string} inputCountry - Form country / territory (e.g. "Australia", "Sydney, Australia")
 * @param {{country: string, countryCode: string, isLocal: boolean}} ipGeo - Resolved IP data
 * @returns {{isMismatch: boolean, alertMessage: string}}
 */
const detectLocationMismatch = (inputCountry, ipGeo) => {
  if (!inputCountry || !ipGeo || ipGeo.isLocal || ipGeo.country === 'Unknown') {
    return { isMismatch: false, alertMessage: '' };
  }

  const normalizedInput = inputCountry.toLowerCase();
  const normalizedIpCountry = ipGeo.country.toLowerCase();
  const ipCode = (ipGeo.countryCode || '').toLowerCase();

  // Common aliases
  const isAusMatch = (normalizedInput.includes('australia') || normalizedInput.includes('sydney') || normalizedInput.includes('melbourne') || normalizedInput.includes('brisbane')) && (normalizedIpCountry.includes('australia') || ipCode === 'au');
  const isUsMatch = (normalizedInput.includes('united states') || normalizedInput.includes('usa') || normalizedInput.includes('us')) && (normalizedIpCountry.includes('united states') || ipCode === 'us');
  const isUkMatch = (normalizedInput.includes('united kingdom') || normalizedInput.includes('uk') || normalizedInput.includes('london')) && (normalizedIpCountry.includes('united kingdom') || ipCode === 'gb');
  const isCaMatch = (normalizedInput.includes('canada') || normalizedInput.includes('toronto')) && (normalizedIpCountry.includes('canada') || ipCode === 'ca');
  const isBdMatch = (normalizedInput.includes('bangladesh') || normalizedInput.includes('dhaka')) && (normalizedIpCountry.includes('bangladesh') || ipCode === 'bd');

  if (isAusMatch || isUsMatch || isUkMatch || isCaMatch || isBdMatch) {
    return { isMismatch: false, alertMessage: '' };
  }

  // If input specifies Australia/US/UK but IP is clearly from another country (e.g. Bangladesh)
  if (normalizedInput.includes('australia') || normalizedInput.includes('sydney') || normalizedInput.includes('united states') || normalizedInput.includes('united kingdom')) {
    if (!normalizedIpCountry.includes(normalizedInput.slice(0, 4))) {
      return {
        isMismatch: true,
        alertMessage: `🚩 Location Mismatch: Submitted "${inputCountry}", but IP is originating from ${ipGeo.country} (${ipGeo.city || 'Regional'})`
      };
    }
  }

  return { isMismatch: false, alertMessage: '' };
};

module.exports = { 
  geocodeAddress, 
  getIpGeoLocation, 
  detectLocationMismatch 
};
