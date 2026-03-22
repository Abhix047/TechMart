export const authorizeRoles = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }

  res.status(403);
  throw new Error("You do not have permission to perform this action");
};

export const admin = authorizeRoles("admin");
