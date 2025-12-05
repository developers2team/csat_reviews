const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');  // ← Keep nodemailer

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  API_BASE_URL
} = process.env;

// FIXED transporter config
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,  // true for port 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
  logger: false
});

// Test endpoint
router.get('/test-smtp', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ smtp: '✅ Connected', port: SMTP_PORT });
  } catch (err) {
    res.status(500).json({ smtp: '❌ Failed', error: err.message });
  }
});

router.post('/resolve', async (req, res) => {
  try {
    const { ticketId, customerEmail } = req.body;

    if (!ticketId || !customerEmail) {
      return res.status(400).json({ message: 'ticketId and customerEmail required' });
    }

    const base = API_BASE_URL || 'https://csat-reviews.onrender.com';
    const url = (rating) => `${base}/api/csat/email-click?ticketId=${encodeURIComponent(ticketId)}&rating=${rating}&email=${encodeURIComponent(customerEmail)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #333;">Ticket #${ticketId} - How satisfied were you?</h2>
        <div style="display: flex; gap: 25px; justify-content: center; margin: 40px 0;">
          <a href="${url(1)}" style="font-size: 36px; color: #ff4444; font-weight: bold; padding: 20px; border-radius: 50%; background: #ffe6e6; text-decoration: none; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(255,68,68,0.3);">1</a>
          <a href="${url(2)}" style="font-size: 36px; color: #ff8800; font-weight: bold; padding: 20px; border-radius: 50%; background: #fff2e6; text-decoration: none; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(255,136,0,0.3);">2</a>
          <a href="${url(3)}" style="font-size: 36px; color: #888; font-weight: bold; padding: 20px; border-radius: 50%; background: #f5f5f5; text-decoration: none; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(136,136,136,0.3);">3</a>
          <a href="${url(4)}" style="font-size: 36px; color: #44aa44; font-weight: bold; padding: 20px; border-radius: 50%; background: #e6f7e6; text-decoration: none; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(68,170,68,0.3);">4</a>
          <a href="${url(5)}" style="font-size: 36px; color: #008800; font-weight: bold; padding: 20px; border-radius: 50%; background: #d4f4d4; text-decoration: none; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,136,0,0.3);">5</a>
        </div>
        <p style="text-align: center; color: #666; font-size: 14px;">
          Click any number to share your feedback
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: customerEmail,
      subject: `Ticket #${ticketId} - Your feedback matters!`,
      html
    });

    res.json({ message: '✅ CSAT email sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Error sending CSAT email', error: err.message });
  }
});

module.exports = router;
