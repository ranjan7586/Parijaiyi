import { Router } from 'express';
import RideEvent from '../models/RideEvent.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── Public ──────────────────────────────────────────────
// /api/rides?status=upcoming  | /api/rides?status=completed
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const sort = req.query.status === 'completed' ? { date: -1 } : { date: 1 };
  const rides = await RideEvent.find(filter).sort(sort);
  res.json(rides);
});

// ── Admin ───────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const ride = await RideEvent.create(req.body);
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const ride = await RideEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  res.json(ride);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const ride = await RideEvent.findByIdAndDelete(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  res.json({ ok: true });
});

export default router;
