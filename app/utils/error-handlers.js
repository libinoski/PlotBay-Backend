// error-handlers.js

// Function to handle validation errors
const handleValidationError = (res, errors) => {
    return res.status(400).json({
        status: "failed",
        message: "Validation failed",
        errors: errors, // Send the array of validation errors in the response
    });
};

// Function to handle database conflict errors
const handleDatabaseConflict = (res, errors) => {
    return res.status(409).json({
        status: "failed",
        message: "Database conflict",
        errors: errors, // Send the array of database conflict errors in the response
    });
};

// Export the functions to be used in other modules
module.exports = { handleValidationError, handleDatabaseConflict };
