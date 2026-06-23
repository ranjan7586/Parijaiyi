import multer from 'multer';

// Keep files in memory so we can stream the buffer straight to Cloudinary.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB (videos)
  fileFilter: (req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image and video files are allowed'));
  },
});
