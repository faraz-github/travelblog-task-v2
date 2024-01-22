import mongoose, { Schema } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;

const blogSchema = new Schema(
  {
    title: { type: String, required: [true, "Please add a title"] },
    coverPicture: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg",
    },
    blogContent: {
      type: String,
      required: [true, "Please add a blog content"],
    },
    author: {
      name: { type: String },
      email: { type: String },
      profilePicture: { type: String },
    },
    comments: [
      {
        comment: { type: String },
        author: { name: { type: String }, profilePicture: { type: String } },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
