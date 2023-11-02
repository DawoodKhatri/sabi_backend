const express = require("express");
const {
  getAvailableSlots,
  createBooking,
  cancelBooking,
  confirmBooking,
  rejectBooking,
  completeBooking,
  rateExperience,
  getCustomerBookings,
  getRestaurantBookings,
} = require("../controllers/Bookings");
const {
  isAuthenticated,
  isCustomerAuth,
  isBusinessAuth,
} = require("../middlewares/auth");

const router = express.Router();

router
  .route("/booking/availableSlots")
  .get(isAuthenticated, isCustomerAuth, getAvailableSlots);
router
  .route("/booking/createBooking")
  .post(isAuthenticated, isCustomerAuth, createBooking);
router
  .route("/booking/cancelBooking/:id")
  .delete(isAuthenticated, isCustomerAuth, cancelBooking);
router
  .route("/booking/confirmBooking/:id")
  .put(isAuthenticated, isBusinessAuth, confirmBooking);
router
  .route("/booking/rejectBooking/:id")
  .delete(isAuthenticated, isBusinessAuth, rejectBooking);
router
  .route("/booking/completeBooking/:id")
  .post(isAuthenticated, isBusinessAuth, completeBooking);
router
  .route("/booking/rateExperience")
  .post(isAuthenticated, isCustomerAuth, rateExperience);
router
  .route("/bookings/customer")
  .get(isAuthenticated, isCustomerAuth, getCustomerBookings);
router
  .route("/bookings/restaurant/:id")
  .get(isAuthenticated, isBusinessAuth, getRestaurantBookings);

module.exports = router;
