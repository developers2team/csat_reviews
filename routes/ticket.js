const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  API_BASE_URL
} = process.env;

// Configure transporter once
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 10,
  logger: false  // Reduce Render logs
});



// POST /api/tickets/resolve
// Body: { "ticketId": "T123", "customerEmail": "user@example.com" }
router.post('/resolve', async (req, res) => {
  try {
    const { ticketId, customerEmail } = req.body;

    if (!ticketId || !customerEmail) {
      return res.status(400).json({ message: 'ticketId and customerEmail required' });
    }

    // Build 5 smiley links
    const base = API_BASE_URL || 'https://localhost:5000';
    const url = (rating) =>
      `${base}/api/csat/email-click?ticketId=${encodeURIComponent(
        ticketId
      )}&rating=${rating}&email=${encodeURIComponent(customerEmail)}`;

    // You can use PNG URLs or emoji; for email, hosted PNGs are safer.
const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      How satisfied are you with the resolution of ticket #${ticketId}?
    </p>
    
    <div style="display: flex; gap: 10px; justify-content: center;">
  <a href="${url(1)}" style="text-decoration: none; font-size: 24px; color: #ff4444; font-weight: bold; margin: 0 10px;">1</a>
  <a href="${url(2)}" style="text-decoration: none; font-size: 24px; color: #ff8800; font-weight: bold; margin: 0 10px;">2</a>
  <a href="${url(3)}" style="text-decoration: none; font-size: 24px; color: #888888; font-weight: bold; margin: 0 10px;">3</a>
  <a href="${url(4)}" style="text-decoration: none; font-size: 24px; color: #44aa44; font-weight: bold; margin: 0 10px;">4</a>
  <a href="${url(5)}" style="text-decoration: none; font-size: 24px; color: #008800; font-weight: bold; margin: 0 10px;">5</a>

    </div>
    
    <p style="font-size: 12px; color: #666; margin-top: 15px;">
      Click any number above to share your feedback
    </p>
  </div>
`;

    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: customerEmail,
      subject: `How was ticket #${ticketId}?`,
      html
    });

    return res.status(200).json({ message: 'CSAT email sent' });
  } catch (err) {
    console.error('Error sending CSAT email:', err);
    return res.status(500).json({ message: 'Error sending CSAT email' });
  }
});

module.exports = router;
