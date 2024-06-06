// s3-config.js

const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Bucket configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to delete image from S3
async function deleteImageFromS3(imageKey) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imageKey
  };
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log("Image deleted from S3:", imageKey);
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
}

module.exports = { s3Client, deleteImageFromS3 };
