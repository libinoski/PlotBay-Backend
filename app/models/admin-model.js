//admin-model.js
const bcrypt = require("bcrypt");
const db = require("../../database/db");
const { promisify } = require("util");
const dbQuery = promisify(db.query.bind(db));

const Admin = function (admin) {
  this.adminId = admin.adminId;
  this.adminName = admin.adminName;
  this.adminEmail = admin.adminEmail;
  this.adminMobile = admin.adminMobile;
  this.adminImage = admin.adminImage;
  this.adminPassword = admin.adminPassword;
  this.deleteStatus = admin.deleteStatus;
  this.updatedStatus = admin.updatedStatus;
  this.updatedDate = admin.updatedDate;
  this.passwordUpdatedStatus = admin.passwordUpdatedStatus;
  this.registeredDate = admin.registeredDate;
  this.isActive = admin.isActive;
};

// Admin register
Admin.register = async (newAdmin) => {
  try {
    const checkEmailQuery =
      "SELECT * FROM Admin WHERE adminEmail = ? AND deleteStatus=0 AND isActive=1";

    const checkMobileQuery =
      "SELECT * FROM Admin WHERE adminMobile = ? AND deleteStatus=0 AND isActive=1";

    const errors = {};

    const emailRes = await dbQuery(checkEmailQuery, [newAdmin.adminEmail]);
    if (emailRes.length > 0) {
      errors["Email"] = ["Email already exists"];
    }

    const mobileRes = await dbQuery(checkMobileQuery, [newAdmin.adminMobile]);
    if (mobileRes.length > 0) {
      errors["Mobile"] = ["Mobile number already exists"];
    }

    if (Object.keys(errors).length > 0) {
      throw { name: "ModelError", errors: errors };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newAdmin.adminPassword, 10);
    newAdmin.adminPassword = hashedPassword;

    const insertQuery = "INSERT INTO Admin SET ?";
    const insertRes = await dbQuery(insertQuery, newAdmin);

    return { adminId: insertRes.insertId, ...newAdmin };
  } catch (error) {
    console.error("Error during admin registration in model:", error);
    throw error;
  }
};

module.exports = { Admin };
