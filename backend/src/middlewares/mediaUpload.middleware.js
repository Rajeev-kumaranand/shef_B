import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure media directory exists
const mediaDir = 'uploads/media/';
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mediaDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check File Type
function checkFileType(file, cb) {
  // Allow images and videos
  const filetypes = /jpeg|jpg|png|webp|svg|mp4|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Invalid file type! Only images and videos are allowed.'));
  }
}

// Init upload
export const uploadMedia = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB limit to accommodate short videos
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});
