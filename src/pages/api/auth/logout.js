import { destroyCookie } from "nookies";

const logout = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Remove the token cookie
  destroyCookie({ res }, "token", { path: "/" });

  res.status(200).json({ message: "Logout successful" });
};

export default logout;
