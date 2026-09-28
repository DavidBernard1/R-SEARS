const axios = require('axios');
const { env } = require('../config/env');

class PoliceService {
  async acceptIncident(incidentId, officerName) {
    if (!env.POLICE_SERVICE_URL) {
      return { success: false, message: 'Police service not configured' };
    }

    const response = await axios.patch(`${env.POLICE_SERVICE_URL}/api/v1/incidents/${incidentId}/accept`, {
      officerName
    });

    return response.data;
  }
}

module.exports = new PoliceService();
