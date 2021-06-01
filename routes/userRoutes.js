const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const { auth } = require('../controllers/authController');

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/all", auth, userController.getAll);
router
  .get("/invitation", auth, userController.getAllInvitation)
  .post("/invitation", auth, userController.createInvitation);
module.exports = router;