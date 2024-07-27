const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbID");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);

    res.status(201).json({
      message: "Coupon created successfully",
      success: true,
      data: newCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedCoupon == null) {
      return res.status(404).json({
        message: "Coupon with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Coupon Updated Successfully",
      success: true,
      data: updatedCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (deletedCoupon == null) {
      return res.status(404).json({
        message: "Coupon with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Coupon deleted Successfully",
      success: true,
      data: deletedCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const findCoupons = await Coupon.find();

    if (findCoupons.length === 0) {
      return res
        .status(404)
        .json({ message: "No coupons found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Coupons found successfully",
      data: findCoupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const findCoupon = await Coupon.findById(id);

    if (findCoupon == null) {
      return res.status(404).json({
        message: "Coupon with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Coupon fetched Successfully",
      success: true,
      data: findCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getSingleCoupon,
};
