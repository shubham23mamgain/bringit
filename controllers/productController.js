const fs = require("fs");
const Product = require("../models/product");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbID");
const slugify = require("slugify");
const cloudinaryUploadImg = require("../utils/cloudinary");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  //   console.log(req.query);
  try {
    // Method 1
    // const findProducts = await Product.find(req.query);

    // Method 2
    // const findProducts = await Product.find({
    //   brand: req.query.brand,
    //   category: req.query.category,
    // });

    // Method 3
    // const findProducts = await Product.where("category").equals(
    //   req.query.category
    // );

    // Favourite Method
    // const findProducts = await Product.find(queryObj);

    // FILTERING

    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((el) => delete queryObj[el]);
    console.log("Reduced Query", queryObj);

    console.log("Original Query", req.query);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // Newly created ITEMS first
    }

    // LIMITING the fields to show or not to show

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // PAGINATION

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("This Page does not exist");
      }
    }

    // FINAL QUERY with FILTERING, SORTING, PAGINATION and SELECTED FIELDS

    const findProducts = await query;

    if (findProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No Products found", success: false });
    }

    res.status(200).json({
      message: "All Products Fetched Successfully",
      data: findProducts,
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const findProduct = await Product.findById(id);

    if (findProduct == null) {
      return res.status(404).json({
        message: "Product with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product with ID found successfully",
      success: true,
      data: findProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedProduct == null) {
      return res.status(404).json({
        message: "Product with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product Updated Successfully",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct == null) {
      return res.status(404).json({
        message: "Product with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product Deleted Successfully",
      success: true,
      data: deletedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);

    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );

      res.status(200).json({ message: "Removed from Wishlist" });
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );

      res.status(200).json({ message: "Added to Wishllist" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);

    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updatedRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );

      // res.status(200).json({ message: "Updated Rating", data: updatedRating });
    } else {
      const ratedProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              postedBy: _id,
              comment: comment,
            },
          },
        },
        {
          new: true,
        }
      );

      // res
      //   .status(200)
      //   .json({ message: "Rated the product", data: ratedProduct });
    }

    const getAllRatings = await Product.findById(prodId);

    let totalRatings = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);

    let actualRating = ratingSum / totalRatings;

    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRatings: actualRating,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Average Rating", data: finalProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];

    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);

      console.log("New path", newPath);
      urls.push(newPath);

      // console.log("Filew", file);
      // fs.unlinkSync(path);
    }

    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      data: findProduct,
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
};
