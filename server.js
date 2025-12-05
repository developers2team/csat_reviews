require('dotenv').config();
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

import csatRoutes from './routes/csat';
import ticketRoutes from './routes/ticket';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(json());

// Routes
app.use('/api/csat', csatRoutes);
app.use('/api/tickets', ticketRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.send('CSAT MERN backend running');
});

// Connect to MongoDB and start server
connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

