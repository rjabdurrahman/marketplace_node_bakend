const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const { authProtect } = require('../controllers/authController');

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/all", authProtect, userController.getAll);
router
  .get("/invitation", authProtect, userController.getAllInvitation)
  .post("/invitation", authProtect, userController.createInvitation);
module.exports = router;