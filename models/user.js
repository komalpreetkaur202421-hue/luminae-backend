const mongoose = require("mongoose");  // Import Mongoose for MongoDB connection

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },   //think schema as a form 
   //before user enters the database they must fill this form 

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  bio: {
  type: String,
  default: "",
},

avatar: {
  type: String,
  default: "",
},

joinedAt: {
  type: Date,
  default: Date.now,
},
});
 // this create a model called user 
const User = mongoose.model("User", userSchema);

module.exports = User;