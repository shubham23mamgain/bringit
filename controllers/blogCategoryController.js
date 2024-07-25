const BlogCategory = require("../models/blogCategory");

const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbID");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategory.create(req.body);

    res.status(201).json({
      message: "Blog Category created successfully",
      success: true,
      data: newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedCategory == null) {
      return res.status(404).json({
        message: "Blog Category with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Blog Category Updated Successfully",
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);

    if (deletedCategory == null) {
      return res.status(404).json({
        message: "Blog Category with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Blog Category deleted Successfully",
      success: true,
      data: deletedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const findBlogCategories = await BlogCategory.find();

    if (findBlogCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No blog categories found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Blog Categories found successfully",
      data: findBlogCategories,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const findBlogCategory = await BlogCategory.findById(id);

    if (findBlogCategory == null) {
      return res.status(404).json({
        message: "Blog Category with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Blog Category fetched Successfully",
      success: true,
      data: findBlogCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getAllBlogCategory,
  getSingleBlogCategory,
};
