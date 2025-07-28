
//created for easeness to work with file-image express cannot parse media file so we use muter to convert 
const multer = require('multer');
const path = require('path');

// Set storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads'); // Folder to save images
  },
   filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-'); // replace spaces with -
    cb(null, Date.now() + '-' + baseName + ext);
  }
});

// Initialize upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
