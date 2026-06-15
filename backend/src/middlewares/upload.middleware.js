import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/slides/');
  },
  filename: function (req, file, cb) {
    // Hardened filename generation: never trust original name
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomUUID();
    cb(null, `${safeName}${ext}`);
  }
});

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// Init upload
export const uploadSlide = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});
