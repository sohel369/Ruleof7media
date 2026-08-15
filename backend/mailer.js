const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Resolves credentials supporting various common variable names/casings
 */
const getCredentials = () => {
  const user = (
    process.env.GMAIL_USER ||
    process.env.GMAIL_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.gmail_user ||
    process.env.gamil_user ||
    process.env.gamil_urser ||
    process.env.MAIL_USER ||
    ''
  ).trim();

  const pass = (
    process.env.GMAIL_APP_PASSWORD ||
    process.env.GMAIL_PASSWORD ||
    process.env.GMAIL_PASS ||
    process.env.gmail_app_password ||
    process.env.gmail_password ||
    process.env.EMAIL_PASS ||
    process.env.MAIL_PASS ||
    process.env.APP_PASSWORD ||
    process.env.app_password ||
    ''
  ).replace(/\s+/g, '');

  return { user, pass };
};

/**
 * Creates and returns a nodemailer transporter
 */
const getTransporter = () => {
  const { user, pass } = getCredentials();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
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
    const { user } = getCredentials();
    const transporter = getTransporter();

    if (!transporter || !user) {
      console.warn('[MAILER] Gmail credentials (GMAIL_USER / GMAIL_APP_PASSWORD) not found. Skipping email notification.');
      return { success: false, error: 'Gmail credentials not configured in environment variables.' };
    }

    if (!to) {
      console.warn('[MAILER] No recipient email address provided. Skipping.');
      return { success: false, error: 'No recipient email specified.' };
    }
    
    const mailOptions = {
      from: `"Rule7Media" <${user}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[MAILER] Error sending email to ' + to + ':', error.message || error);
    return { success: false, error: error.message || String(error) };
  }
};

module.exports = { sendEmail, getCredentials };


