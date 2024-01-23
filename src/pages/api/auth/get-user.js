import { verify } from "jsonwebtoken";
import { parse } from "cookie";
import User from "@/models/User";

const SECRET = process.env.JWT_SECRET; // Replace with the same secure secret key used for signing JWT tokens

const getUser = async (req, res) => {
  try {
    // Retrieve the token from the request cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    // If the token is not present, the user is not authenticated
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token using the secret key
    const decodedToken = verify(token, SECRET);
    const { email } = decodedToken;

    // Check if the username already exists
    const existingUser = await User.findOne({ email }).select("-password");
    const { name, profilePicture } = existingUser;

    // If user is found return user details
    res
      .status(200)
      .json({ message: "Authenticated", user: { name, profilePicture } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getUser;
