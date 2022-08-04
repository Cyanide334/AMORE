var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../api/models/users");
const userController = require('../api/controllers/users');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.patch('/edit',userController.edit);
router.get('/view/:id', userController.view)
router.post('/forgotPassword', userController.forgotPassword);
router.get('/reset', userController.resetPassword);

module.exports = router;
