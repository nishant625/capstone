// backend/routes/session.js

import express from 'express';
import Session from '../models/session.js';

const router = express.Router();

// Route to fetch sessions by driver code
// backend/routes/session.js
router.get('/:driverCode', async (req, res) => {
    try {
      const { driverCode } = req.params;
      const limit = parseInt(req.query.limit) || 0;  // Get the limit from query, default to 0 (fetch all)
  
      console.log('Fetching sessions for driver:', driverCode);
  
      // Fetch sessions based on limit
      const sessions = limit ? await Session.find({ driver_code: driverCode }).limit(limit) : await Session.find({ driver_code: driverCode });
      
      if (sessions.length === 0) {
        return res.status(404).json({ message: 'Session data not found' });
      }
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

export default router;
