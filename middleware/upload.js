import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "event_images",
        format: async (req, file) => "png",
        public_id: (req, file) => `${Date.now()}_${file.originalname}`,
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        return cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"));
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
