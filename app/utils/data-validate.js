const path = require('path');

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|heif)$/;
const MAX_CONTENT_LENGTH = 2000;
const MAX_TITLE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 500;
const MAX_ADDRESS_LENGTH = 100;

// Helper function to check if a value is null or undefined
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

// Helper function to validate non-empty values
function validateNonEmpty(value, fieldName) {
    if (isNullOrUndefined(value) || value.trim() === "") {
        return { isValid: false, message: `${fieldName} cannot be empty.` };
    }
    return { isValid: true };
}

// Validate password
function isValidPassword(password) {
    const validation = validateNonEmpty(password, "Password");
    if (!validation.isValid) return validation;

    const messages = [];
    if (!/[a-z]/.test(password)) messages.push("Include at least one lowercase letter.");
    if (!/[A-Z]/.test(password)) messages.push("Include at least one uppercase letter.");
    if (!/\d/.test(password)) messages.push("Include at least one digit.");
    if (!/[\W_]/.test(password)) messages.push("Include at least one special character.");
    if (!/^[a-zA-Z\d\W_]{8,12}$/.test(password)) messages.push("Should be 8 to 12 characters long.");

    return { isValid: messages.length === 0, message: messages.join(' ') };
}

// Validate content
function isValidContent(content) {
    const validation = validateNonEmpty(content, "Content");
    if (!validation.isValid) return validation;
    
    if (content.length > MAX_CONTENT_LENGTH) {
        return { isValid: false, message: `Content exceeds the maximum length of ${MAX_CONTENT_LENGTH} characters.` };
    }

    const regex = /^[\p{L}\p{M}\p{N}\p{P}\p{Z}]+$/u;
    return { isValid: regex.test(content), message: "Content contains invalid characters." };
}

// Validate the title's correctness.
function isValidTitle(title) {
    const validation = validateNonEmpty(title, "Title");
    if (!validation.isValid) return validation;

    const messages = [];
    if (title.length > MAX_TITLE_LENGTH) {
        messages.push(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
    }

    const regex = /^[\w\s!@#$%^&*()-_=+[\]{}|;:'",.<>/?]*$/;
    if (!regex.test(title)) {
        messages.push("Title contains invalid characters.");
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Title is valid' };
}

// Validate an image within a 1 MB size limit.
function isValidImageWith1MBConstraint(file) {
    if (isNullOrUndefined(file)) {
        return { isValid: false, message: 'Please upload a file.' };
    }

    const messages = [];
    const filename = file.filename || file.originalname;
    const extensionIsValid = ALLOWED_IMAGE_EXTENSIONS.test(path.extname(filename.replace(/[^\w\-.]/g, '')).toLowerCase());
    const sizeIsValid = file.size <= MAX_IMAGE_SIZE;

    if (!extensionIsValid) {
        messages.push('Invalid file format. Only JPG, JPEG, PNG, WEBP, and HEIF files are allowed.');
    }
    if (!sizeIsValid) {
        messages.push('File size exceeds the limit of 1 MB.');
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'File is valid' };
}

// Verify the validity of a mobile number.
function isValidMobileNumber(mobileNumber) {
    const validation = validateNonEmpty(mobileNumber, "Mobile number");
    if (!validation.isValid) return validation;

    const sanitizedMobileNumber = mobileNumber.replace(/\s/g, '');
    return {
        isValid: /^\+91[6-9]\d{9}$|^[6-9]\d{9}$/.test(sanitizedMobileNumber),
        message: "Invalid Mobile Number"
    };
}

// Verify the correctness of an address.
function isValidAddress(address) {
    const validation = validateNonEmpty(address, "Address");
    if (!validation.isValid) return validation;

    return {
        isValid: address.trim().length <= MAX_ADDRESS_LENGTH,
        message: `Address should not exceed ${MAX_ADDRESS_LENGTH} characters`
    };
}

// Confirm the validity of an email address.
function isValidEmail(email) {
    const validation = validateNonEmpty(email, "Email");
    if (!validation.isValid) return validation;

    return {
        isValid: /^[a-z0-9._!#$%&'*+/=?^_`{|}~-]+@[a-z]+(\.[a-z]+)+$/.test(email),
        message: "Invalid Email!"
    };
}

// Confirm the validity of a name.
function isValidName(name) {
    const validation = validateNonEmpty(name, "Name");
    if (!validation.isValid) return validation;

    return {
        isValid: /^[a-zA-Z\s]*$/.test(name),
        message: "Name must contain only alphabets"
    };
}

// Validate a message with a maximum length of 500 characters.
function isValidMessage(message) {
    const validation = validateNonEmpty(message, "Message");
    if (!validation.isValid) return validation;

    if (message.length > MAX_MESSAGE_LENGTH) {
        return { isValid: false, message: `Message exceeds the maximum length of ${MAX_MESSAGE_LENGTH} characters.` };
    }
    return { isValid: true, message: "Message is valid." };
}

// Validate cost as an integer or decimal number (cannot be null)
function isValidCost(cost) {
    const validation = validateNonEmpty(cost, "Cost");
    if (!validation.isValid) return validation;

    const sanitizedCost = cost.replace(/\s/g, "");
    const regex = /^\d+(\.\d+)?$/;
    return {
        isValid: regex.test(sanitizedCost),
        message: "Invalid Cost. It must be an integer or decimal number."
    };
}

// Export all validation functions
module.exports = {
    isEmpty: validateNonEmpty,
    isValidMobileNumber,
    isValidAddress,
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidImageWith1MBConstraint,
    isValidContent,
    isValidTitle,
    isValidMessage,
    isValidCost
};
