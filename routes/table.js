const express = require("express");
const { addTable, deleteTable, getTables } = require("../controllers/Table");
const { isAuthenticated, isBusinessAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/table/add").post(isAuthenticated, isBusinessAuth, addTable);
router.route("/table/:id").delete(isAuthenticated, isBusinessAuth, deleteTable);
router.route("/tables/:id").get(getTables);

module.exports = router;
