const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImage");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);
router.get("/", getAllBlogs);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.get("/:id", getSingleBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
