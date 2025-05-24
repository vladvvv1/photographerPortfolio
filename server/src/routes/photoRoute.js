import express from "express";
import multer from "multer";
import getPhotos from "../controllers/getPhotosController.js";
import uploadPhoto from "../controllers/uploadController.js";
import deletePhoto from "../controllers/deleteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/getPhotos", getPhotos);

router.post("/uploadPhoto", upload.array("photos"), authMiddleware, uploadPhoto);
router.delete("/deletePhoto", deletePhoto);

export default router;
