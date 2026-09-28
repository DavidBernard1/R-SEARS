class SMSService {
  async sendEmergencySMS({ phone, message }) {
    const provider = process.env.SMS_PROVIDER || 'mock';

    if (provider === 'mock') {
      return {
        success: true,
        message: `SMS queued to ${phone}: ${message}`,
        provider
      };
    }

    return {
      success: false,
      message: 'Configured SMS provider is not available in this environment.',
      provider
    };
  }
}

module.exports = new SMSService();
