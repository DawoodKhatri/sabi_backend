const express = require("express");
const {
  addChef,
  deleteChef,
  getAllChefs,
  getRestaurantChefs,
} = require("../controllers/Chef");
const { isAuthenticated, isBusinessAuth } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const router = express.Router();

router
  .route("/chef/add")
  .post(isAuthenticated, isBusinessAuth, upload.single("file"), addChef);
router.route("/chef/:id").delete(isAuthenticated, isBusinessAuth, deleteChef);
router.route("/chefs").get(getAllChefs);
router.route("/chefs/:id").get(getRestaurantChefs);

module.exports = router;
