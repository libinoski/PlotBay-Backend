//multer-config.js
const multer = require("multer");

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("adminImage");

function handleAdminImageUpload(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error
      console.log("Multer error:", err);
      return res.status(400).json({
        status: "failed",
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      // Internal server error
      console.log("Internal server error:", err);
      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
        error: err.message,
      });
    }
    next();
  });
}

module.exports = { upload, handleAdminImageUpload };