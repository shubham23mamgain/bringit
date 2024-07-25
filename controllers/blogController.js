const Blog = require("../models/blog");
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbID");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      data: newBlog,
      message: "Blog Created Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedBlog == null) {
      return res.status(404).json({
        message: "Blog with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Blog Updated Successfully",
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbID(id);

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (deletedBlog == null) {
      return res.status(404).json({
        message: "Blog with Given ID not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Blog Deleted Successfully",
      success: true,
      data: deletedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const findBlogs = await Blog.find();

    if (findBlogs.length === 0)
      return res
        .status(404)
        .json({ message: "No Blogs Found", success: false });

    res.status(200).json({
      message: "Blogs Fetched Successfully",
      success: true,
      data: findBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbID(id);

  try {
    const findBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");

    if (findBlog == null) {
      return res.status(404).json({
        message: "Blog with Given ID not found",
        success: false,
      });
    }

    const updatedViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Blog with GIVEN ID Fetched Successfully",
      success: true,
      // data: updatedViews,
      data: findBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  validateMongodbID(blogId);

  // Find blog which you want to be liked
  const blog = await Blog.findById(blogId);

  // Find the login user
  const loginUserId = req?.user?._id;

  // Find if user has liked the blog i.e. user is already present in the likes array
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // Find if user has disliked the blog i.e. the user is already present in the dislikes array
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // If user, has already disliked blog remove user from disklikes array
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }

  // If user has already liked , remove his like
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );

    res.json({ message: " Already Liked, now removing like", blog });
  }
  // If user has not liked or previuosly disliked, like the blog
  else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );

    res.json({ message: " Not liked before, now liking", blog });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  validateMongodbID(blogId);

  // Find blog which you want to be disliked
  const blog = await Blog.findById(blogId);

  // Find the login user
  const loginUserId = req?.user?._id;

  // Find if user has disliked the blog i.e. the user is already present in the dislikes array
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // Find if user has liked the blog i.e. user is already present in the likes array
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // If user has already liked the blog, remove user from likes array
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );

    // return res.json({
    //   message: " Remove already liked from likes array",
    //   blog,
    // });
  }

  // If user has already disliked , remove his dislike
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );

    res.json({ message: " Already DisLiked now removing dislike", blog });
  }
  // If user has not disliked, dislike the blog
  else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );

    res.json({ message: " Not disliked before, now disliking", blog });
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
