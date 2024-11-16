// backend/models/session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  total_session_time_seconds: Number,
  total_drowsy_time_seconds: Number,
  total_headpose_time_seconds: Number,
  total_yawn_time_seconds: Number,
  drowsy_alerts: Number,
  headpose_alerts: Number,
  yawn_alerts: Number,
  session_start_time: Date,
  session_end_time: Date,
  driver_code: String,  // This should match the driverCode in your request
});

const Session = mongoose.model('Session', sessionSchema, 'session_data'); // 'session_data' collection

export default Session;
