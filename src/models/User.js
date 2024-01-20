import mongoose, { Schema } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: { type: String, required: [true, "Please add a password"] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
