// Import required modules
const path = require("path");
const fs = require("fs");
const { Admin } = require("../models/admin-model");
const dataValidator = require("../utils/data-validate");
const { uploadAdminImage } = require("../config/s3-config");
const transporter = require("../config/email-config");
const emailContent = require("../utils/email-contents");
const multer = require("multer");

// Endpoint function for admin registration
exports.register = async (req, res) => {
  try {
    // Set up multer storage
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage }).single("adminImage");

    // Handle file upload
    upload(req, res, async function (err) {
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

      // Extract data from request
      const adminData = req.body;
      const adminImageFile = req.file;

      // Function to validate admin registration data
      function validateAdminRegistration(adminData, adminImageFile) {
        const validationResults = {
          isValid: true,
          errors: {},
        };

        // Validate admin name
        const nameValidation = dataValidator.isValidName(adminData.adminName);
        if (!nameValidation.isValid) {
          validationResults.isValid = false;
          validationResults.errors["adminName"] = [nameValidation.message];
        }

        // Validate admin email
        const emailValidation = dataValidator.isValidEmail(adminData.adminEmail);
        if (!emailValidation.isValid) {
          validationResults.isValid = false;
          validationResults.errors["adminEmail"] = [emailValidation.message];
        }

        // Validate admin mobile number
        const mobileValidation = dataValidator.isValidMobileNumber(adminData.adminMobile);
        if (!mobileValidation.isValid) {
          validationResults.isValid = false;
          validationResults.errors["adminMobile"] = [mobileValidation.message];
        }

        // Validate admin password
        const passwordValidation = dataValidator.isValidPassword(adminData.adminPassword);
        if (!passwordValidation.isValid) {
          validationResults.isValid = false;
          validationResults.errors["adminPassword"] = [passwordValidation.message];
        }

        // Validate admin image if provided
        if (adminImageFile) {
          const imageValidation = dataValidator.isValidFile(adminImageFile);
          if (!imageValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors["adminImage"] = [imageValidation.message];
          }
        }

        return validationResults;
      }

      // Validate admin registration data
      const validationResults = validateAdminRegistration(adminData, adminImageFile);
      if (!validationResults.isValid) {
        // Handle validation errors
        if (adminImageFile && adminImageFile.path) {
          fs.unlinkSync(adminImageFile.path);
        }
        return res.status(400).json({
          status: "failed",
          message: "Validation failed",
          errors: validationResults.errors,
        });
      }

      try {
        // Register admin
        const registrationResponse = await Admin.register(adminData);

        // Upload admin image if provided
        let fileLocation;
        if (adminImageFile) {
          const fileName = `adminImage-${Date.now()}${path.extname(adminImageFile.originalname)}`;
          const mimeType = adminImageFile.mimetype;
          fileLocation = await uploadAdminImage(adminImageFile, fileName, mimeType);
          registrationResponse.adminImage = fileLocation;
        }

        // Send registration email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: registrationResponse.adminEmail,
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

        // Respond with success message
        return res.status(200).json({
          status: "success",
          message: "Admin registered successfully",
          data: registrationResponse,
        });
      } catch (error) {
        // Handle registration errors
        if (error.name === "ValidationError") {
          if (adminImageFile && adminImageFile.path) {
            fs.unlinkSync(adminImageFile.path);
          }
          return res.status(400).json({
            status: "failed",
            message: "Validation failed",
            errors: error.errors
          });
        } else {
          return res.status(500).json({
            status: "failed",
            message: "Internal server error",
            error: error.message,
          });
        }
      }
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message,
    });
  }
};
