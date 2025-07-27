const express = require('express');
const router = express.Router();
const registerController = require('../../../controllers/registerController');
const profileController = require('../../../controllers/profileController');

router.post('/', registerController.handleRegister, profileController.handleCreateProfile); // Register and create profile

module.exports = router;