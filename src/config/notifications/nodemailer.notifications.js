import { createTransport } from 'nodemailer';
import env from '../env.config.js';

const sendEmail = async (emailData) => {
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: env.ETHEREAL_ADMIN_EMAIL,
      pass: env.ETHEREAL_ADMIN_PASSWORD,
    },
  });
  const products = emailData.products.map((item) => {
    return `<h3 style="font-weight: bolder">${item.productName}</h3> <p>${item.price}</p>`;
  });
  const email = {
    from: 'servidor',
    to: env.ETHEREAL_ADMIN_EMAIL,
    subject: `nuevo pedido de ${emailData.user} con email ${emailData.email}`,
    html: `${products.join('')}`,
  };
  try {
    const responsefromNodeMailer = await transporter.sendMail(email);
    return responsefromNodeMailer;
  } catch (error) {
    return error;
  }
};

export { sendEmail };
