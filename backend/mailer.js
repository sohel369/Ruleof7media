const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Creates and returns a nodemailer transporter
 */
const getTransporter = () => {
  const user = (process.env.GMAIL_USER || '').trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
};

/**
 * Sends an email notification
 * @param {string} to - The recipient email address
 * @param {string} subject - The email subject
 * @param {string} htmlContent - The HTML body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn('[MAILER] Gmail credentials (GMAIL_USER / GMAIL_APP_PASSWORD) not found. Skipping email notification.');
      return false;
    }

    if (!to) {
      console.warn('[MAILER] No recipient email address provided. Skipping.');
      return false;
    }
    
    const mailOptions = {
      from: `"Rule7Media" <${process.env.GMAIL_USER.trim()}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[MAILER] Error sending email to ' + to + ':', error.message || error);
    return false;
  }
};

module.exports = { sendEmail };

