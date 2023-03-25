const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { register, login, logout, getUser } = require("../controllers/User");

const router = express.Router();

router.route("/user/register").post(register);
router.route("/user/login").post(login);
router.route("/user/logout").post(isAuthenticated, logout);
router.route("/user").get(isAuthenticated, getUser);

module.exports = router;
