import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Token generate karo, jisme payload mein sirf user ka ID hoga
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token 30 din tak valid rahega
  });

  // Token ko HTTP-Only cookie mein set karo (Ye industry standard security hai)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Production mein sirf HTTPS par chalega
    sameSite: "strict", // CSRF attacks se bachane ke liye
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days in milliseconds
  });
};

export default generateToken;