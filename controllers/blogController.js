const Blog = require("../models/Blog");
const {marked } = require("marked");
// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, theme, category, coverImage } = req.body;
    const newBlog = new Blog({
      title,
      content,
      theme,
      category,
      coverImage,
      author: req.user ? req.user.id : null,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
   const blogs = await Blog.find()
      .populate("author", "name email")
      .populate("comments.user", "name email");
    res.status(200).json({
      message: "All blogs fetched",
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get a single blog by ID
// Get Single Blog
const getSingleBlog = async (req, res) => {
  try {
  const blog = await Blog.findById(req.params.id)
  .populate("author", "name email")
  .populate("comments.user", "name email");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Check blog owner
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    if (req.body.category !== undefined) blog.category = req.body.category;
    if (req.body.coverImage !== undefined) blog.coverImage = req.body.coverImage;
    if (req.body.theme !== undefined) blog.theme = req.body.theme;

    const updatedBlog = await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Check blog owner
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      message: "Blog deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const likeBlog = async (req, res) => {
  try {
    console.log("--- LOGGED IN USER PAYLOAD ---", req.user);
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 1. Safety check using .id (matching your createBlog and protect logic)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized - user ID missing" });
    }

    // 2. Initialize likes array if it doesn't exist in the database
    if (!blog.likes) {
      blog.likes = [];
    }

    // Convert to standard string for comparison
    const userId = req.user.id.toString();

    // 3. Toggle Like / Unlike safely
    if (blog.likes.includes(userId)) {
      // Already liked -> Remove the like
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Not liked yet -> Add the like
      blog.likes.push(userId);
    }

    await blog.save();
    return res.status(200).json({ likes: blog.likes });
    
  } catch (error) {
    console.error("--- LIKE BLOG ERROR STACK TRACE ---", error);
    return res.status(500).json({ message: error.message });
  }
};

//comments function 
// Add Comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      user: req.user.id,
      text: text.trim()
    };

    blog.comments.push(newComment);
    await blog.save();

    // Populate user info on the freshly saved comments before returning
    const updatedBlog = await Blog.findById(req.params.id).populate("comments.user", "name email");

    res.status(201).json(updatedBlog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find the targeted comment inside the subdocument array
    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Authorization check: Compare ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Use Mongoose's built-in subdocument removal function
    comment.deleteOne();
    await blog.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment
};
