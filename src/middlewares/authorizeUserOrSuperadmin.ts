import { Request, Response, NextFunction } from "express";

export const authorizeUserOrSuperadmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (user.role === "superadmin") return next();

  // ownership by route param
  const resourceUserId = req.params.id;
  if (resourceUserId && user.id === resourceUserId) return next();

  return res.status(403).json({ message: "Forbidden" });
};

export const authorizeSuperadminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (user.role !== "superadmin") return res.status(403).json({ message: "Forbidden" });
  return next();
};

export default authorizeUserOrSuperadmin;

