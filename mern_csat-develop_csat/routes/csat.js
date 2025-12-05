const express = require('express');
const router = express.Router();
const CsatResponse = require('../models/CsatResponse');

// GET /api/csat/email-click?ticketId=123&rating=4&email=a@b.com
router.get('/email-click', async (req, res) => {
  try {
    const { ticketId, rating, email } = req.query;

    if (!ticketId || !rating) {
      return res.status(400).send('Missing ticketId or rating');
    }

    await CsatResponse.create({
      ticketId,
      rating: Number(rating),
      customerEmail: email
    });

    // Simple thank-you page
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Thank you</title>
        </head>
        <body>
          <p>Thank you for your feedback! 🙂</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error recording CSAT');
  }
});

module.exports = router;
