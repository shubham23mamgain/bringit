const mongooose = require("mongoose");

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

const ProdCategory = mongooose.model("ProdCategory", prodCategorySchema);

module.exports = ProdCategory;
