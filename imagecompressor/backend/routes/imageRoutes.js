const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), async (req, res) => {
  const originalPath = req.file.path;
  const outputPath = path.join('compressed', `${Date.now()}.png`);

  try {
    let buffer = await sharp(originalPath).png().toBuffer();
    let quality = 100;

    while (buffer.length > 1000000 && quality >= 10) {
      buffer = await sharp(originalPath)
        .png({ quality })
        .toBuffer();
      quality -= 10;
    }

    fs.writeFileSync(outputPath, buffer);

    res.download(outputPath, 'compressed.png', () => {
      fs.unlinkSync(originalPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).json({ error: 'Image compression failed' });
  }
});

module.exports = router;
