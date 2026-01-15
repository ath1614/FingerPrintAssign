const sharp = require('sharp');

async function processFingerprint(imagePath) {
  const { data } = await sharp(imagePath)
    .grayscale()
    .resize(128, 128)
    .normalize()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  return Array.from(data);
}

module.exports = { processFingerprint };