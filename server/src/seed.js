import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';
import Rider from './models/Rider.js';
import Media from './models/Media.js';
import RideEvent from './models/RideEvent.js';

// Demo imagery uses Unsplash so the site looks alive before you wire Cloudinary.
const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const riders = [
  {
    name: 'Arnab Sen', bike: 'Royal Enfield Himalayan 450', experience: '9 yrs • 140,000 km',
    profession: 'Architect', favoriteDestination: 'Spiti Valley',
    quote: 'The road remembers everyone who dares to cross it.',
    bio: 'Founder of the flock. Lives for high-altitude passes and bad cell coverage.',
    imageUrl: u('1558981403-c5f9899a28bc'), order: 1,
  },
  {
    name: 'Rito Banerjee', bike: 'KTM 390 Adventure', experience: '6 yrs • 85,000 km',
    profession: 'Software Engineer', favoriteDestination: 'Ladakh',
    quote: 'Four wheels move the body, two wheels move the soul.',
    bio: 'Our navigator. Has never met a switchback he did not like.',
    imageUrl: u('1517649763962-0c623066013b'), order: 2,
  },
  {
    name: 'Sayan Ghosh', bike: 'Triumph Tiger 900', experience: '11 yrs • 210,000 km',
    profession: 'Doctor', favoriteDestination: 'Darjeeling',
    quote: 'Adventure is just bad planning told beautifully.',
    bio: 'Patches us up and keeps the pace. The calm in every storm.',
    imageUrl: u('1583394838336-acd977736f90'), order: 3,
  },
  {
    name: 'Megha Roy', bike: 'BMW G 310 GS', experience: '5 yrs • 60,000 km',
    profession: 'Photographer', favoriteDestination: 'Zanskar',
    quote: 'I came for the views and stayed for the people.',
    bio: 'The eye behind most of our frames. Chases golden hour relentlessly.',
    imageUrl: u('1534528741775-53994a69daeb'), order: 4,
  },
];

const photos = [
  { category: 'Nature', url: u('1469474968028-56623f02e42e') },
  { category: 'Nature', url: u('1506905925346-21bda4d32df4') },
  { category: 'The Road', url: u('1558981852-426c6c22a060') },
  { category: 'The Road', url: u('1502920917128-1aa500764cbd') },
  { category: 'Group Selfies', url: u('1517649763962-0c623066013b') },
  { category: 'Candids', url: u('1485965120184-e220f721d03e') },
  { category: 'Abstracts', url: u('1507525428034-b723cf961d3e') },
  { category: 'Nature', url: u('1454496522488-7a8e488e8606') },
].map((p) => ({ ...p, type: 'image' }));

const rides = [
  {
    title: 'Spiti Circuit — The Cold Desert', status: 'upcoming',
    date: new Date('2026-08-12'),
    description: 'Shimla → Kaza → Chandratal. 9 days across the highest motorable passes.',
    location: 'Spiti Valley', lat: 32.246, lng: 78.072,
  },
  {
    title: 'Monsoon Run to the Coast', status: 'upcoming',
    date: new Date('2026-07-05'),
    description: 'A wet, wild weekend chasing the rain down to Mandarmani.',
    location: 'Mandarmani', lat: 21.66, lng: 87.69,
  },
  {
    title: 'Ladakh — Roof of the World', status: 'completed',
    date: new Date('2025-06-20'),
    description: 'Khardung La conquered. 14 days, 8 riders, one unforgettable flock.',
    location: 'Leh, Ladakh', lat: 34.152, lng: 77.577,
  },
  {
    title: 'Darjeeling Tea & Mist', status: 'completed',
    date: new Date('2024-11-02'),
    description: 'Toy-train tracks and Himalayan sunrises from Tiger Hill.',
    location: 'Darjeeling', lat: 27.041, lng: 88.262,
  },
];

async function run() {
  await connectDB();

  // Admin
  const email = (process.env.ADMIN_EMAIL || 'admin@parijaiyi.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  let admin = await Admin.findOne({ email });
  if (!admin) {
    admin = new Admin({ email, name: 'Parijaiyi Admin' });
    await admin.setPassword(password);
    await admin.save();
    console.log(`✔ Admin created → ${email} / ${password}`);
  } else {
    console.log(`• Admin already exists → ${email}`);
  }

  // Content (reset demo content each seed)
  await Promise.all([Rider.deleteMany({}), Media.deleteMany({}), RideEvent.deleteMany({})]);
  await Rider.insertMany(riders);
  await Media.insertMany(photos);
  await RideEvent.insertMany(rides);
  console.log(`✔ Seeded ${riders.length} riders, ${photos.length} photos, ${rides.length} rides`);

  await mongoose.disconnect();
  console.log('✔ Done');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
