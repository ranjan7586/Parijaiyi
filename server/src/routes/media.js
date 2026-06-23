import { Router } from 'express';
import Media, { PHOTO_CATEGORIES } from '../models/Media.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer, destroyAsset, isCloudinaryConfigured } from '../config/cloudinary.js';

const router = Router();

router.get('/categories', (_req, res) => res.json(PHOTO_CATEGORIES));

// ── Public ──────────────────────────────────────────────
// /api/media?type=image&category=Nature
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  const media = await Media.find(filter).sort({ uploadedAt: -1 });
  res.json(media);
});

// ── Admin: upload one or many ───────────────────────────
router.post('/', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    if (!isCloudinaryConfigured())
      return res.status(400).json({ error: 'Cloudinary is not configured on the server' });
    if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });

    const { category = 'Nature', title = '' } = req.body;
    const created = await Promise.all(
      req.files.map(async (file) => {
        const isVideo = file.mimetype.startsWith('video/');
        const result = await uploadBuffer(file.buffer, {
          folder: `parijaiyi/${isVideo ? 'videos' : 'photos'}`,
          resourceType: isVideo ? 'video' : 'image',
        });
        return Media.create({
          title,
          url: result.secure_url,
          publicId: result.public_id,
          type: isVideo ? 'video' : 'image',
          category,
          width: result.width || 0,
          height: result.height || 0,
        });
      }),
    );
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!media) return res.status(404).json({ error: 'Media not found' });
  res.json(media);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) return res.status(404).json({ error: 'Media not found' });
  if (media.publicId) await destroyAsset(media.publicId, media.type).catch(() => {});
  res.json({ ok: true });
});

export default router;
