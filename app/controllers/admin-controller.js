//admin-controller.js

const path = require("path");
const { Admin } = require("../models/admin-model");
const dataValidator = require("../utils/data-validate");
const { uploadAdminImage } = require("../config/s3-config");
const transporter = require("../config/email-config");
const emailContent = require("../utils/email-contents");
const { handleAdminImageUpload } = require("../config/multer-config");
const { handleValidationError, handleDatabaseConflict } = require("../utils/error-handlers");

exports.register = async (req, res) => {
  try {
    // Handle file upload
    handleAdminImageUpload(req, res, async function () {
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
        
          const imageValidation = dataValidator.isValidFile(adminImageFile);
          if (!imageValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors["adminImage"] = [imageValidation.message];
          }

        return validationResults;
      }

      // Validate admin registration data
      const validationResults = validateAdminRegistration(adminData, adminImageFile);
      if (!validationResults.isValid) {
        // Handle validation errors using the reusable function
        return handleValidationError(res, validationResults.errors);
      }

      try {
        let fileLocation = '';
        if (adminImageFile) {
          const fileName = `adminImage-${Date.now()}${path.extname(adminImageFile.originalname)}`;
          const mimeType = adminImageFile.mimetype;
          fileLocation = await uploadAdminImage(adminImageFile, fileName, mimeType);
          adminData.adminImage = fileLocation; // Assign admin image file location to adminData
        }

        // Register admin and call model function
        const registrationResponse = await Admin.register(adminData);
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
        // Handle registration errors from model
        if (error.name === "ModelError") {
          return handleDatabaseConflict(res, error.errors);
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
