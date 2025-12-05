const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/resolve', async (req, res) => {
  try {
    const { ticketId, customerEmail } = req.body;

    if (!ticketId || !customerEmail) {
      return res.status(400).json({ message: 'ticketId and customerEmail required' });
    }

    // const base = process.env.API_BASE_URL || 'https://csat-reviews.onrender.com';
    // const url = (rating) => `${base}/api/csat/email-click?ticketId=${encodeURIComponent(ticketId)}&rating=${rating}&email=${encodeURIComponent(customerEmail)}`;

// FIXED URL generation
const baseUrl = (process.env.API_BASE_URL || 'https://csat-reviews.onrender.com').replace(/\/$/, '');
const url = (rating) => `${baseUrl}/api/csat/email-click?ticketId=${encodeURIComponent(ticketId)}&rating=${rating}&email=${encodeURIComponent(customerEmail)}`;


    const msg = {
      to: customerEmail,
      from: process.env.FROM_EMAIL,
      subject: `Ticket #${ticketId} - How satisfied were you?`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px;">Ticket #${ticketId}</h2>
          <p style="color: #666; font-size: 18px; margin-bottom: 40px;">
            How satisfied were you with our service?
          </p>

          <div style="display: flex; gap: 30px; justify-content: center; margin: 40px 0;">
  <a href="${url(1)}" style="text-decoration: none; font-size: 24px; color: #ff4444; font-weight: bold;">1</a>
  <a href="${url(2)}" style="text-decoration: none; font-size: 24px; color: #ff8800; font-weight: bold;">2</a>
  <a href="${url(3)}" style="text-decoration: none; font-size: 24px; color: #888888; font-weight: bold;">3</a>
  <a href="${url(4)}" style="text-decoration: none; font-size: 24px; color: #44aa44; font-weight: bold;">4</a>
  <a href="${url(5)}" style="text-decoration: none; font-size: 24px; color: #008800; font-weight: bold;">5</a>
</div>
                     
          
          <p style="color: #999; font-size: 14px;">
            Click any number above to share your feedback. Thank you! 🙏
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    res.json({ message: '✅ CSAT email sent successfully!' });
  } catch (error) {
    console.error('SendGrid error:', error.response ? error.response.body : error.message);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

module.exports = router;
