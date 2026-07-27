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

module.exports = { geocodeAddress };
