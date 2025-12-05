require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const csatRoutes = require('./routes/csat.js');      // ← .js added
const ticketRoutes = require('./routes/ticket.js');  // ← .js added

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/csat', csatRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CSAT API running!' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
