const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getSingleCoupon,
} = require("../controllers/couponController");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);
router.get("/", getAllCoupons);
router.get("/:id", getSingleCoupon);

module.exports = router;
