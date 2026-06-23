import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['contact', 'application'], required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
    // Application-specific fields
    bike: { type: String, default: '' },
    experience: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('Message', messageSchema);
