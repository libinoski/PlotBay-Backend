const path = require("path");
const jwt = require("jsonwebtoken");
const { admin } = require("../models/admin-model");
const dataValidator = require("../utils/data-validate");
const fs = require("fs");
const { s3Client, deleteImageFromS3 } = require("../config/s3-config");
const transporter = require("../config/email-config");
const emailContent = require("../utils/email-contents");
//
//
//
//
// REGISTER ADMIN
exports.register = async (req, res) => {
  try {
    const adminData = req.body;
    // Check and manipulate adminMobile if present
    if (adminData.adminMobile) {
      adminData.adminMobile = adminData.adminMobile.replace(/\s/g, '');
    }

    function validateAdminRegistration(adminData, adminImageFile) {
      const validationResults = {
        isValid: true,
        errors: {},
      };

      // Name validation
      const nameValidation = dataValidator.isValidName(adminData.adminName);
      if (!nameValidation.isValid) {
        validationResults.isValid = false;
        validationResults.errors["adminName"] = [nameValidation.message];
      }

      // Email validation
      const emailValidation = dataValidator.isValidEmail(adminData.adminEmail);
      if (!emailValidation.isValid) {
        validationResults.isValid = false;
        validationResults.errors["adminEmail"] = [emailValidation.message];
      }


      // Mobile validation
      const mobileValidation = dataValidator.isValidMobileNumber(adminData.adminMobile);
      if (!mobileValidation.isValid) {
        validationResults.isValid = false;
        validationResults.errors["adminMobile"] = [mobileValidation.message];
      }


      // Password validation
      const passwordValidation = dataValidator.isValidPassword(adminData.adminPassword);
      if (!passwordValidation.isValid) {
        validationResults.isValid = false;
        validationResults.errors["adminPassword"] = [passwordValidation.message];
      }

      // Image validation
      if (adminImageFile) {
        const imageValidation = dataValidator.isValidImageWith1MBConstraint(adminImageFile);
        if (!imageValidation.isValid) {
          validationResults.isValid = false;
          validationResults.errors["adminImage"] = [imageValidation.message];
          if (adminData.adminImage) {
            deleteImageFromS3(adminData.adminImage.split('/').pop());
          }
        }
      }

      return validationResults;
    }

    function uploadAdminImage(adminImageFile, fileName, mimeType) {
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

    const adminImageFile = req.file;

    const validationResults = validateAdminRegistration(adminData, adminImageFile);

    if (!validationResults.isValid) {
      return res.status(400).json({
        status: "failed",
        message: "Validation failed",
        results: validationResults.errors,
      });
    }

    let fileLocation;
    if (adminImageFile) {
      const fileName = `adminImage-${Date.now()}${path.extname(adminImageFile.originalname)}`;
      const mimeType = adminImageFile.mimetype;

      try {
        fileLocation = await uploadAdminImage(adminImageFile, fileName, mimeType);
        adminData.adminImage = fileLocation;
      } catch (uploadError) {
        throw uploadError;
      }
    }

    try {
      const registrationResponse = await admin.register(adminData);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: registrationResponse.adminEmail, // Assuming email is part of the response
        subject: emailContent.subject,
        text: emailContent.text.replace("{{adminName}}", registrationResponse.adminName),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(200).json({
        status: "success",
        message: "Admin registered successfully",
        data: registrationResponse,
      });
    } catch (error) {
      if (adminImageFile && adminImageFile.filename) {
        const imagePath = path.join("Files/AdminImages", adminImageFile.filename);
        fs.unlinkSync(imagePath);
      }

      if (adminData.adminImage) {
        deleteImageFromS3(adminData.adminImage.split('/').pop());
      }

      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message,
    });
  }
};
