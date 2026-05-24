import { Request, Response, NextFunction } from "express";

export const authorizeSuperadminOnly = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.dbUser;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (user.role !== "superadmin") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  next();
};

export const authorizeUserOrSuperadmin = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.dbUser;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (user.role === "superadmin") {
    return next();
  }

  const resourceUserId = req.params.id;

  if (resourceUserId && user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    message: "Forbidden",
  });
};