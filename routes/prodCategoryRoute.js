const express = require("express");
const {
  createProdCategory,
  updateProdCategory,
  deleteProdCategory,
  getAllProdCategory,
  getSingleProdCategory,
} = require("../controllers/prodCategoryontroller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProdCategory);
router.put("/:id", authMiddleware, isAdmin, updateProdCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteProdCategory);
router.get("/", getAllProdCategory);
router.get("/:id", getSingleProdCategory);

module.exports = router;
