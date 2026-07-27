const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using Gmail SMTP
// Note: Requires GMAIL_USER and GMAIL_APP_PASSWORD in .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

/**
 * Sends an email notification to a partner
 * @param {string} to - The recipient email address
 * @param {string} subject - The email subject
 * @param {string} htmlContent - The HTML body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Gmail credentials not found in .env. Skipping email notification.');
      return false;
    }
    
    const mailOptions = {
      from: `"Rule7Media Partner Network" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };
