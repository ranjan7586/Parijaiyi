import mongoose from 'mongoose';

const rideEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date },
    description: { type: String, default: '' },
    status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
    // For the "Places We've Conquered" map (used when status === 'completed')
    location: { type: String, default: '' },
    lat: { type: Number },
    lng: { type: Number },
    coverUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('RideEvent', rideEventSchema);
