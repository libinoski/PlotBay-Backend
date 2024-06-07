//data-validate.js

// Check if a value is empty, null, undefined, or an empty object
function isEmptyOrNullUndefined(value) {
    if (value === '' || value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
    return false;
}

// Validate password
function isValidPassword(password) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(password)) {
        messages.push("Password is required.");
    } else {
        if (!/[a-z]/.test(password)) messages.push("Include at least one lowercase letter.");
        if (!/[A-Z]/.test(password)) messages.push("Include at least one uppercase letter.");
        if (!/\d/.test(password)) messages.push("Include at least one digit.");
        if (!/[\W_]/.test(password)) messages.push("Include at least one special character.");
        if (password.length < 8 || password.length > 12) messages.push("Should be 8 to 12 characters long.");
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Password is valid.' };
}

// Validate mobile number
function isValidMobileNumber(mobileNumber) {
    const messages = [];
    const cleanedNumber = mobileNumber ? mobileNumber.replace(/\s/g, '') : ''; // Remove white spaces if not null or undefined
    
    if (isEmptyOrNullUndefined(cleanedNumber)) {
        messages.push("Mobile number is required.");
    } else {
        if (!/^\d{10}$/.test(cleanedNumber)) {
            messages.push("Mobile number should contain exactly 10 digits.");
        }
    
        if (!/^\d+$/.test(cleanedNumber)) {
            messages.push("Mobile number should only contain digits (0-9).");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Mobile number is valid.' };
}

// Validate email
function isValidEmail(email) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(email)) {
        messages.push("Email is required.");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            messages.push("Invalid email format.");
        } else {
            const allowedDomains = [
                'gmail.com',
                'outlook.com',
                'yahoo.com',
                'aol.com',
                'icloud.com',
                'protonmail.com',
                'zoho.com',
                'gmx.com',
                'yandex.com',
                'mail.com'
            ];
            const domain = email.split('@')[1];
            if (!allowedDomains.includes(domain)) {
                messages.push("Email domain not allowed.");
            }
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Email is valid.' };
}

// Validate name
function isValidName(name) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(name)) {
        messages.push("Name is required.");
    } else {
        if (name.length > 50) {
            messages.push("Name should not exceed 50 characters.");
        }
    
        if (/\d/.test(name)) {
            messages.push("Name should not contain numbers.");
        }
    
        if (/[^a-zA-Z]/.test(name)) {
            messages.push("Name should not contain special characters.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Name is valid.' };
}

// Validate cost
function isValidCost(cost) {
    const messages = [];
    const cleanedCost = cost ? cost.replace(/\s/g, '') : ''; 
    
    if (isEmptyOrNullUndefined(cleanedCost)) {
        messages.push("Cost is required.");
    } else {
        if (!/^\d+(\.\d+)?$/.test(cleanedCost)) {
            messages.push("Cost should only contain numbers and optionally a decimal point.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Cost is valid.' };
}

// Validate file
function isValidFile(file) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(file)) {
        messages.push("Please upload a file.");
    } else if (file.size && file.size > 1048576) {
        messages.push("File size should be less than or equal to 1 MB.");
    }

    // Check file extension
    if (!isEmptyOrNullUndefined(file)) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heif'];
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            messages.push("File extension not allowed. Allowed extensions are: jpg, jpeg, png, webp, heif.");
        }
    }
    
    return { isValid: messages.length === 0, message: messages.join(' ') || 'File is valid.' };
}

// Validate comment
function isValidComment(comment) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(comment)) {
        messages.push("Comment is required.");
    } else {
        if (comment.length > 2000) {
            messages.push("Comment should not exceed 2000 characters.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Comment is valid.' };
}

// Validate address
function isValidAddress(address) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(address)) {
        messages.push("Address is required.");
    } else {
        if (address.length > 2000) {
            messages.push("Address should not exceed 2000 characters.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Address is valid.' };
}

// Validate age
function isValidAge(age) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(age)) {
        messages.push("Age is required.");
    } else {
        if (!/^\d{1,3}$/.test(age)) {
            messages.push("Age should be a number with at most 3 digits.");
        } else {
            const numericAge = parseInt(age);
            if (numericAge < 0 || numericAge > 100) {
                messages.push("Age should be between 0 and 100.");
            }
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Age is valid.' };
}

// Validate year
function isValidYear(year) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(year)) {
        messages.push("Year is required.");
    } else {
        const dateFormats = [
            /^\d{2}\/\d{2}\/\d{4}$/,   // dd/mm/yyyy
            /^\d{4}\/\d{2}\/\d{2}$/,   // yyyy/mm/dd
            /^\d{2}-\d{2}-\d{4}$/,     // dd-mm-yyyy
            /^\d{4}-\d{2}-\d{2}$/      // yyyy-mm-dd
        ];
        if (!dateFormats.some(format => format.test(year))) {
            messages.push("Invalid year format. Valid formats are: dd/mm/yyyy, yyyy/mm/dd, dd-mm-yyyy, yyyy-mm-dd.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Year is valid.' };
}

// Validate area
function isValidArea(area) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(area)) {
        messages.push("Area is required.");
    } else {
        if (area.length > 150) {
            messages.push("Area should not exceed 150 characters.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Area is valid.' };
}

// Validate country
function isValidCountry(country) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(country)) {
        messages.push("Country is required.");
    } else {
        if (country.length > 150) {
            messages.push("Country should not exceed 150 characters.");
        }
        
        if (!/^[a-zA-Z]+$/.test(country)) {
            messages.push("Country should only contain alphabetic characters.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Country is valid.' };
}

// Validate state
function isValidState(state) {
    const messages = [];
    
    if (isEmptyOrNullUndefined(state)) {
        messages.push("State is required.");
    } else {
        if (state.length > 150) {
            messages.push("State should not exceed 150 characters.");
        }
        
        if (!/^[a-zA-Z\s]+$/.test(state)) {
            messages.push("State should only contain alphabetic characters and spaces.");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'State is valid.' };
}

// Validate Aadhar number
function isValidAadharNumber(aadharNumber) {
    const messages = [];
    const cleanedAadharNumber = aadharNumber ? aadharNumber.replace(/\s/g, '') : ''; // Remove white spaces if not null or undefined
    
    if (isEmptyOrNullUndefined(cleanedAadharNumber)) {
        messages.push("Aadhar number is required.");
    } else {
        if (!/^\d{12}$/.test(cleanedAadharNumber)) {
            messages.push("Aadhar number should contain exactly 12 digits.");
        }
    
        if (!/^\d+$/.test(cleanedAadharNumber)) {
            messages.push("Aadhar number should only contain digits (0-9).");
        }
    }

    return { isValid: messages.length === 0, message: messages.join(' ') || 'Aadhar number is valid.' };
}

// Export the validation functions
module.exports = {
    isValidPassword,
    isValidMobileNumber,
    isValidEmail,
    isValidName,
    isValidCost,
    isValidFile,
    isValidComment,
    isValidAddress,
    isValidAge,
    isValidYear,
    isValidArea,
    isValidCountry,
    isValidState,
    isValidAadharNumber
};