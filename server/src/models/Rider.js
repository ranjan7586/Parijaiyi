import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    bike: { type: String, default: '' },
    experience: { type: String, default: '' }, // e.g. "8 yrs • 120,000 km"
    profession: { type: String, default: '' },
    quote: { type: String, default: '' },
    favoriteDestination: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' }, // Cloudinary handle for deletion
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Rider', riderSchema);
