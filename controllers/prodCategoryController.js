const ProdCategory = require("../models/prodcategory");

const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbID");

const createProdCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await ProdCategory.create(req.body);

    res.status(201).json({
      message: "Prod Category created successfully",
      success: true,
      data: newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const updatedCategory = await ProdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedCategory == null) {
      return res.status(404).json({
        message: "Product Category with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product Category Updated Successfully",
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const deletedCategory = await ProdCategory.findByIdAndDelete(id);

    if (deletedCategory == null) {
      return res.status(404).json({
        message: "Product Category with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product Category deleted Successfully",
      success: true,
      data: deletedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProdCategory = asyncHandler(async (req, res) => {
  try {
    const findProductCategories = await ProdCategory.find();

    if (findProductCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No product categories found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Product Categories found successfully",
      data: findProductCategories,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const findProductCategory = await ProdCategory.findById(id);

    if (findProductCategory == null) {
      return res.status(404).json({
        message: "Product Category with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product Category fetched Successfully",
      success: true,
      data: findProductCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProdCategory,
  updateProdCategory,
  deleteProdCategory,
  getAllProdCategory,
  getSingleProdCategory,
};
