import { getAuth } from "@clerk/express";

/**
 * Middleware that enforces authentication on protected routes.
 * Attaches userId to req for downstream use.
 */
const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Please sign in." });
  }

  req.userId = userId;
  next();
};

export default requireAuth;
