import mongoose from 'mongoose';

export const PHOTO_CATEGORIES = ['Nature', 'The Road', 'Group Selfies', 'Abstracts', 'Candids'];

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    category: { type: String, default: 'Nature' }, // photos use PHOTO_CATEGORIES; videos free-form
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: true } },
);

export default mongoose.model('Media', mediaSchema);
