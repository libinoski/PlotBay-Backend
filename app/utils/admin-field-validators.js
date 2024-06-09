const dataValidator = require("../utils/data-validate");

function validateAdminFields(adminData, adminImageFile) {
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

module.exports = { validateAdminFields };
