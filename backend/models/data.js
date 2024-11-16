import mongoose from 'mongoose';

const sessionDataSchema = new mongoose.Schema({
  total_session_time_seconds: { type: Number, required: true },
  total_drowsy_time_seconds: { type: Number, required: true },
  total_headpose_time_seconds: { type: Number, required: true },
  total_yawn_time_seconds: { type: Number, required: true },
  drowsy_alerts: { type: Number, required: true },
  headpose_alerts: { type: Number, required: true },
  yawn_alerts: { type: Number, required: true },
  session_start_time: { type: Date, required: true },
  session_end_time: { type: Date, required: true },
});

// Ensure it points to the correct collection in the database
export default mongoose.model('SessionData', sessionDataSchema, 'session_data');
