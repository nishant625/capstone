import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './routes/data.js';
import driverRoutes from './routes/driver.js';  // Import the driver registration routes

import sessionRoutes from './routes/session.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Import and use routes
app.use('/api', dataRoutes);
app.use('/api/driver', driverRoutes);  // Use the driver routes for /api/driver
app.use('/api/sessions', sessionRoutes);  // Use a different base for session routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
