const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    default: "midnight",
  },

  category: {
    type: String,
  },

  coverImage: {
    type: String,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      text: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});


module.exports = mongoose.model("Blog", blogSchema);

