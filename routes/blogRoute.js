const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.get("/", getAllBlogs);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.get("/:id", getSingleBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
