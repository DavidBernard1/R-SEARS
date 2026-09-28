const axios = require('axios');
const { env } = require('../config/env');

class HospitalService {
  async dispatchAmbulance({ ambulanceId, incidentId, hospitalId }) {
    if (!env.HOSPITAL_SERVICE_URL) {
      return { success: false, message: 'Hospital service not configured' };
    }

    const response = await axios.post(`${env.HOSPITAL_SERVICE_URL}/api/v1/dispatch`, {
      ambulanceId,
      incidentId,
      hospitalId
    });

    return response.data;
  }
}

module.exports = new HospitalService();
