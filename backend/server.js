const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { compareFingerprints } = require('./fingerprintMatcher');

const app = express();
const PORT = 4000;

// Auto-create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// JSON middleware
app.use(express.json());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Verify endpoint
app.post('/verify', upload.fields([{ name: 'fingerprint1' }, { name: 'fingerprint2' }]), async (req, res) => {
  try {
    if (!req.files.fingerprint1 || !req.files.fingerprint2) {
      return res.status(400).json({ error: 'Both fingerprint images required' });
    }
    
    const result = await compareFingerprints(
      req.files.fingerprint1[0].path,
      req.files.fingerprint2[0].path
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});