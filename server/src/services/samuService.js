const axios = require('axios');
const { env } = require('../config/env');

class SAMUService {
  async assignNearestAmbulance({ latitude, longitude, incidentId }) {
    if (!env.SAMU_SERVICE_URL) {
      return { success: false, message: 'SAMU service not configured' };
    }

    const response = await axios.post(`${env.SAMU_SERVICE_URL}/api/v1/ambulances/assign`, {
      latitude,
      longitude,
      incidentId
    });

    return response.data;
  }
}

module.exports = new SAMUService();
