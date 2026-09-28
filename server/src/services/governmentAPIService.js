const axios = require('axios');
const { env } = require('../config/env');

class GovernmentAPIService {
  async sendIncident({ incidentPayload }) {
    if (!env.GOVERNMENT_API_BASE_URL) {
      return { success: false, message: 'Government API configuration is missing' };
    }

    const response = await axios.post(`${env.GOVERNMENT_API_BASE_URL}/incident-alerts`, incidentPayload, {
      headers: {
        Authorization: `Bearer ${env.GOVERNMENT_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }
}

module.exports = new GovernmentAPIService();
