import { Router } from 'express';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── Public: submit contact or join-the-group form ───────
router.post('/', async (req, res) => {
  try {
    const { type, name } = req.body;
    if (!['contact', 'application'].includes(type))
      return res.status(400).json({ error: 'Invalid submission type' });
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const msg = await Message.create(req.body);
    // Hook for admin notification (email/Slack) goes here.
    console.log(`📨 New ${type} submission from ${name}`);
    res.status(201).json({ ok: true, id: msg._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Admin: inbox ────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  const messages = await Message.find(filter).sort({ createdAt: -1 });
  res.json(messages);
});

router.patch('/:id/read', requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { read: req.body.read ?? true },
    { new: true },
  );
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  res.json(msg);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  res.json({ ok: true });
});

export default router;
