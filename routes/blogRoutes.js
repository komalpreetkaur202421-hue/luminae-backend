const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment
} = require("../controllers/blogController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createBlog);
router.get("/", getAllBlogs);
router.put("/:id", protect, updateBlog);
router.get("/:id", getSingleBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/like", protect, likeBlog);
router.post("/:id/comments", protect, addComment);
router.delete("/:blogId/comments/:commentId", protect, deleteComment);


module.exports = router;
