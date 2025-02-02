const mongoose = require("mongoose");

const prodCategorySchema = new mongoose.Schema(
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

const ProdCategory = mongoose.model("ProdCategory", prodCategorySchema);

module.exports = ProdCategory;
