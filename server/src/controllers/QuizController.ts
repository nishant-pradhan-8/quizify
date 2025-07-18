import { Request, Response } from "express";
import { ImageToText } from "../services/OcrService";
import { generateQuiz } from "../services/QuizGenerateService";
import PDFDocument from "pdfkit";

type QuizQuestion = {
  question: string;
  choices: string[];
  answer: number;
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const file: Express.Multer.File | undefined = req.file;
    if (!file) {
      res.status(400).json({
        status: "error",
        messsage: "File is required.",
        data: null,
      });
      return;
    }

    const imageText: string | null = await ImageToText(file);

    if (imageText === null) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error.",
        data: null,
      });
      return;
    }

    if (imageText.length === 0) {
      res.status(400).json({
        status: "error",
        message:
          "Unable to generate quiz. Make sure the image includes legible text and is of high resolution.",
        data: null,
      });
      return;
    }

    const quiz = await generateQuiz(imageText);

    if (!quiz) {
      console.log(quiz);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Quiz Generated Successfully",
      data: quiz,
    });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
    return;
  }
};

export const downloadQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = req.body.quiz as QuizQuestion[];
    if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
      res.status(400).json({
        status: "error",
        message: "Invalid quiz data.",
        data: null,
      });
      return;
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="quiz.pdf"');
    doc.pipe(res);

    doc.fontSize(20).text("Quiz Questions", { align: "center" }).moveDown();

    quiz.forEach((q: QuizQuestion, index: number) => {
      doc
        .fontSize(14)
        .fillColor("black")
        .text(`${index + 1}. ${q.question}`);

      q.choices.forEach((choice: string, i: number) => {
        const isAnswer = i === q.answer ? " (Correct Answer)" : "";
        doc
          .fontSize(12)
          .fillColor("blue")
          .text(`   ${String.fromCharCode(65 + i)}. ${choice}${isAnswer}`);
      });

      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: null,
    });
  }
};
