// backend/routes/data.js

import express from 'express';
import Driver from '../models/driver.js';

const router = express.Router();

// Route to fetch all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find({}, 'name driverCode'); // Only fetch name and driverCode
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
