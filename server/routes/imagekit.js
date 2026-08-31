import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import requireAuth from "../middlewares/clerkAuth.js";

dotenv.config();

const router = express.Router();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * GET /api/upload
 * Returns ImageKit authentication parameters for client-side uploads.
 * Protected: requires Clerk auth.
 */
router.get("/", requireAuth, (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.json(result);
});

export default router;
