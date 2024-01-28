import { parse } from "cookie";
import { destroyCookie } from "nookies";

const logout = (req, res) => {
  try {
    // Retrieve the token from the request cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    if (token) {
      // Remove the token cookie
      destroyCookie({ res }, "token", { path: "/" });

      res.status(200).json({ message: "Logout successful" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default logout;
