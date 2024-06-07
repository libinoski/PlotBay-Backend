// s3-config.js

// Import necessary AWS SDK modules and dotenv for environment variables
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Create an S3 client instance with AWS credentials from environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



// Function to upload an admin image to the S3 bucket
async function uploadAdminImage(adminImageFile, fileName, mimeType) {
  return new Promise(async (resolve, reject) => {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `adminImages/${fileName}`,
      Body: adminImageFile.buffer,
      ACL: "public-read",
      ContentType: mimeType,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      const fileLocation = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      resolve(fileLocation);
    } catch (uploadError) {
      reject(uploadError);
    }
  });
}

// Export S3 client instance, deleteImageFromS3, and uploadAdminImage functions for external use
module.exports = { s3Client, uploadAdminImage };
