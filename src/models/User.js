import mongoose, { Schema } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/farazdevmedia/image/upload/v1706196357/TravelBlog-Task/Users/Placeholder/User_Placeholder_zfnnh1.jpg",
    },
    password: { type: String, required: [true, "Please add a password"] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
