const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

module.exports = BlogCategory;
