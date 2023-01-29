import twilio from 'twilio';
import env from '../env.config.js';

const twilioSID = env.SID_TWILIO;
const twilioToken = env.TOKEN_TWILIO;
const wthspOriginPhone = env.WHATSAPP_TWILIO;
const wthspDestinyPhone = env.PHONE_DESTINY_WHATSAPP;

const sendWthsp = async (dataMessage) => {
  const twilioConnection = twilio(twilioSID, twilioToken);
  const options = {
    body: `nuevo pedido de ${dataMessage.user} con email ${dataMessage.email}`,
    from: wthspOriginPhone,
    to: wthspDestinyPhone,
  };

  try {
    const responseFromWthspTwilio = await twilioConnection.messages.create(options);
    return responseFromWthspTwilio;
  } catch (error) {
    console.log(error);
  }
};

export { sendWthsp };
