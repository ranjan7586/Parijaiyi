import { Router } from 'express';
import Admin from '../models/Admin.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin || !(await admin.verifyPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(admin);
  res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
});

router.get('/me', requireAuth, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-passwordHash');
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  res.json({ admin });
});

export default router;
