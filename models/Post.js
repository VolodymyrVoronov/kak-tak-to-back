import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postText: String,
  userLogin: String,
  createdAt: String,
  comments: [
    {
      commentText: String,
      userLogin: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      userLogin: String,
      createdAt: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
