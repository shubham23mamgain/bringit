const Brand = require("../models/brand");

const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbID");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);

    res.status(201).json({
      message: "Brand created successfully",
      success: true,
      data: newBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedBrand == null) {
      return res.status(404).json({
        message: "Brand with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Brand Updated Successfully",
      success: true,
      data: updatedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (deletedBrand == null) {
      return res.status(404).json({
        message: "Brand with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Brand deleted Successfully",
      success: true,
      data: deletedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const findBrands = await Brand.find();

    if (findBrands.length === 0) {
      return res
        .status(404)
        .json({ message: "No brands found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Brands found successfully",
      data: findBrands,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const findBrand = await Brand.findById(id);

    if (findBrand == null) {
      return res.status(404).json({
        message: "Brand with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Brand fetched Successfully",
      success: true,
      data: findBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
};
