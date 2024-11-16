import express from 'express';
import Driver from '../models/driver.js';

const router = express.Router();

// Route to register a new driver
router.post('/register', async (req, res) => {
  try {
    const { name, driverCode, password, phoneNumber } = req.body;

    // Check if the driver already exists
    const existingDriver = await Driver.findOne({ driverCode });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver code already exists' });
    }

    // Create new driver
    const newDriver = new Driver({
      name,
      driverCode,
      password,
      phoneNumber,
    });

    await newDriver.save();
    res.status(201).json({ message: 'Driver registered successfully', driver: newDriver });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
