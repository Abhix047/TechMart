import mongoose from "mongoose";

export const validate = (validator) => (req, res, next) => {
  const errors = validator(req);

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  next();
};

export const validateObjectIdParam = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ message: `Invalid ${paramName}` });
  }

  next();
};
