const mongoose = require('mongoose');

const csatResponseSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    customerEmail: { type: String },
    clickedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('reviews', csatResponseSchema);
