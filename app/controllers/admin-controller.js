const path = require("path");
const { Admin } = require("../models/admin-model");
const { uploadAdminImageToS3 } = require("../config/s3-config");
const transporter = require("../config/email-config");
const emailContent = require("../utils/email-contents");
const { handleAdminImageUpload } = require("../config/multer-config");
const { handleValidationError, handleDatabaseConflict } = require("../utils/error-handlers");
const { validateAdminFields } = require("../utils/admin-field-validators"); // Adjust the path as necessary

exports.register = async (req, res) => {
  try {
    // Handle file upload
    handleAdminImageUpload(req, res, async function () {
      // Extract data from request
      const adminData = req.body;
      const adminImageFile = req.file;

      // Validate admin registration data
      const validationResults = validateAdminFields(adminData, adminImageFile);
      if (!validationResults.isValid) {
        // Handle validation errors using the reusable function
        return handleValidationError(res, validationResults.errors);
      }

      try {
        let fileLocation = '';
        if (adminImageFile) {
          const fileName = `adminImage-${Date.now()}${path.extname(adminImageFile.originalname)}`;
          const mimeType = adminImageFile.mimetype;
          fileLocation = await uploadAdminImageToS3(adminImageFile, fileName, mimeType);
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
