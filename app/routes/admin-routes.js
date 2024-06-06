const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');


router.post("/adminRegister", adminController.register);

module.exports = router;