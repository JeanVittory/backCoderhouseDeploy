import twilio from 'twilio';
import env from '../env.config.js';

const twilioSID = env.SID_TWILIO;
const twilioToken = env.TOKEN_TWILIO;
const phoneTwilio = env.PHONE_TWILIO;
const phoneNumberDestiny = env.PHONE_DESTINY;

const sendSms = async () => {
  const twilioConnection = twilio(twilioSID, twilioToken);
  const options = {
    body: 'Your order has been received and is being processed',
    from: phoneTwilio,
    to: phoneNumberDestiny,
  };
  try {
    const message = await twilioConnection.messages.create(options);
    return message;
  } catch (error) {
    return error;
  }
};

export { sendSms };
