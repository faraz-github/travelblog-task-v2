import { verify } from "jsonwebtoken";
import { parse } from "cookie";

const SECRET = process.env.JWT_SECRET; // Replace with the same secure secret key used for signing JWT tokens

const checkAuth = async (req, res) => {
  try {
    // Retrieve the token from the request cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    // If the token is not present, the user is not authenticated
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token using the secret key
    const decodedToken = verify(token, SECRET);

    // If verification is successful, the user is authenticated
    res.status(200).json({ message: "Authenticated", user: decodedToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default checkAuth;
