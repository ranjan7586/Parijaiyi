// Fallback content so the site looks alive even before the API/DB is running.
const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const MOCK_RIDERS = [
  { _id: 'm1', name: 'Arnab Sen', bike: 'Royal Enfield Himalayan 450', experience: '9 yrs • 140,000 km', profession: 'Architect', favoriteDestination: 'Spiti Valley', quote: 'The road remembers everyone who dares to cross it.', bio: 'Founder of the flock. Lives for high-altitude passes.', imageUrl: u('1558981403-c5f9899a28bc') },
  { _id: 'm2', name: 'Rito Banerjee', bike: 'KTM 390 Adventure', experience: '6 yrs • 85,000 km', profession: 'Software Engineer', favoriteDestination: 'Ladakh', quote: 'Four wheels move the body, two wheels move the soul.', bio: 'Our navigator. Never met a switchback he did not like.', imageUrl: u('1517649763962-0c623066013b') },
  { _id: 'm3', name: 'Sayan Ghosh', bike: 'Triumph Tiger 900', experience: '11 yrs • 210,000 km', profession: 'Doctor', favoriteDestination: 'Darjeeling', quote: 'Adventure is just bad planning told beautifully.', bio: 'Patches us up and keeps the pace.', imageUrl: u('1583394838336-acd977736f90') },
  { _id: 'm4', name: 'Megha Roy', bike: 'BMW G 310 GS', experience: '5 yrs • 60,000 km', profession: 'Photographer', favoriteDestination: 'Zanskar', quote: 'I came for the views and stayed for the people.', bio: 'The eye behind most of our frames.', imageUrl: u('1534528741775-53994a69daeb') },
];

export const MOCK_PHOTOS = [
  { _id: 'p1', category: 'Nature', type: 'image', url: u('1469474968028-56623f02e42e') },
  { _id: 'p2', category: 'Nature', type: 'image', url: u('1506905925346-21bda4d32df4') },
  { _id: 'p3', category: 'The Road', type: 'image', url: u('1558981852-426c6c22a060') },
  { _id: 'p4', category: 'The Road', type: 'image', url: u('1502920917128-1aa500764cbd') },
  { _id: 'p5', category: 'Group Selfies', type: 'image', url: u('1517649763962-0c623066013b') },
  { _id: 'p6', category: 'Candids', type: 'image', url: u('1485965120184-e220f721d03e') },
  { _id: 'p7', category: 'Abstracts', type: 'image', url: u('1507525428034-b723cf961d3e') },
  { _id: 'p8', category: 'Nature', type: 'image', url: u('1454496522488-7a8e488e8606') },
];

export const MOCK_RIDES = {
  upcoming: [
    { _id: 'r1', title: 'Spiti Circuit — The Cold Desert', date: '2026-08-12', description: 'Shimla → Kaza → Chandratal. 9 days across the highest motorable passes.', location: 'Spiti Valley' },
    { _id: 'r2', title: 'Monsoon Run to the Coast', date: '2026-07-05', description: 'A wet, wild weekend chasing the rain down to Mandarmani.', location: 'Mandarmani' },
  ],
  completed: [
    { _id: 'r3', title: 'Ladakh — Roof of the World', date: '2025-06-20', location: 'Leh, Ladakh', lat: 34.152, lng: 77.577, description: 'Khardung La conquered. 14 days, 8 riders.' },
    { _id: 'r4', title: 'Darjeeling Tea & Mist', date: '2024-11-02', location: 'Darjeeling', lat: 27.041, lng: 88.262, description: 'Toy-train tracks and Himalayan sunrises.' },
    { _id: 'r5', title: 'Spiti 2024', date: '2024-06-15', location: 'Kaza', lat: 32.246, lng: 78.072, description: 'Our first taste of the cold desert.' },
  ],
};

export const PLACES = ['Spiti', 'Darjeeling', 'Ladakh', 'Zanskar', 'Sandakphu', 'Mandarmani'];
