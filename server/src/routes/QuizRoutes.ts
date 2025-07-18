import express from "express";
import multer from 'multer';
import { getQuiz, downloadQuiz } from "../controllers/QuizController";
const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

router.post("/", upload.single('file'), getQuiz);
router.post("/download", downloadQuiz)

export default router; 