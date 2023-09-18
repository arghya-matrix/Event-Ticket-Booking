const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const userValidation = require('../middleware/user.validation');
const userMiddleware = require('../middleware/tokenVerify');

router.post("/signup",userValidation.validationUser,userController.signUp);
router.post("/login", userController.signIn);
router.put("/update",userMiddleware.userProfile,userController.updateUser);

router.delete("/delete",userMiddleware.userProfile,userController.deleteUser);
router.get("/getUser",userMiddleware.userProfile,userController.getUser);
// router.get("/profile",userMiddleware.userProfile,userController.userProfile);

module.exports = router