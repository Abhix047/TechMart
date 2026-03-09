// Agar user kisi aisi API par request maare jo exist hi nahi karti (e.g., /api/xyz)
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Hamara custom Error Handler jo plain HTML ki jagah JSON bheja karega
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MongoDB ka ek specific error hota hai "CastError" jab Object ID galat format mein ho
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    // Production mein stack trace hide kar dete hain security ke liye
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};