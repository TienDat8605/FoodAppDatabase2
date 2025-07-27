const multer = require('multer');

const storage = multer.memoryStorage(); // Store in memory, not disk
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB for other images like food images
});

module.exports = upload;
