require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Secret for signed cookies
const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecret";

// Middleware
app.use(cors({ origin: "https://owncloud-smoky.vercel.app", credentials: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

// Upload folder
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// --- Login route ---
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    // Set signed cookie for 1 day
    res.cookie("auth", "true", {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none", // important for cross-origin
      secure: true,
    
    });
    return res.status(200).json({ message: "Logged in successfully" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

function authMiddleware(req, res, next) {
  if (req.signedCookies.auth === "true") return next();
  return res.status(401).json({ message: "Unauthorized" });
}

app.post("/upload", authMiddleware, upload.array("files"), (req, res) => {
  res.json({ message: "File uploaded!", files: req.files });
});

app.get("/check-auth", authMiddleware, (req, res) => {
  res.json({ loggedIn: true });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});