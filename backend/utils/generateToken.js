import jwt from "jsonwebtoken";

export const buildAuthCookieOptions = (req) => {
  const isLocalhost = req?.get('host')?.includes('localhost') || process.env.NODE_ENV === "development";
  return {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: isLocalhost ? "lax" : "none",
    path: "/",
  };
};

const generateToken = (req, res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    ...buildAuthCookieOptions(req),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
