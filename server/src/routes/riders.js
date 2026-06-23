import { Router } from 'express';
import Rider from '../models/Rider.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer, destroyAsset, isCloudinaryConfigured } from '../config/cloudinary.js';

const router = Router();

// ── Public ──────────────────────────────────────────────
router.get('/', async (_req, res) => {
  const riders = await Rider.find().sort({ order: 1, createdAt: 1 });
  res.json(riders);
});

// ── Admin ───────────────────────────────────────────────
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      if (!isCloudinaryConfigured())
        return res.status(400).json({ error: 'Cloudinary is not configured on the server' });
      const result = await uploadBuffer(req.file.buffer, { folder: 'parijaiyi/riders', resourceType: 'image' });
      data.imageUrl = result.secure_url;
      data.imagePublicId = result.public_id;
    }
    const rider = await Rider.create(data);
    res.status(201).json(rider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });

    Object.assign(rider, req.body);
    if (req.file) {
      if (!isCloudinaryConfigured())
        return res.status(400).json({ error: 'Cloudinary is not configured on the server' });
      if (rider.imagePublicId) await destroyAsset(rider.imagePublicId, 'image');
      const result = await uploadBuffer(req.file.buffer, { folder: 'parijaiyi/riders', resourceType: 'image' });
      rider.imageUrl = result.secure_url;
      rider.imagePublicId = result.public_id;
    }
    await rider.save();
    res.json(rider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const rider = await Rider.findByIdAndDelete(req.params.id);
  if (!rider) return res.status(404).json({ error: 'Rider not found' });
  if (rider.imagePublicId) await destroyAsset(rider.imagePublicId, 'image').catch(() => {});
  res.json({ ok: true });
});

export default router;
