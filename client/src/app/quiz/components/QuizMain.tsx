'use client'
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/Store/Context";
import QuizCard from "./QuizCard";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface Selection {
  [questionId: number]: number;
}

export default function QuizMain() {
  const { quiz } = useAppContext();
  const router = useRouter();

  const [selectedAnswers, setSelectedAnswers] = useState<any>({});

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [downloading, setDownloading] = useState<boolean>(false);

  const handleSelect = (questionId: number, selectedOption: number) => {
    selectedAnswers[questionId] = selectedOption;
    setSelectedAnswers(selectedAnswers);
  };

  useEffect(() => {
    if (!quiz) {
      router.push("/");
    }
  }, []);


  const allAnswered = quiz
    ? Object.keys(selectedAnswers).length === quiz.length
    : false;

  const handleSubmit = () => {
    setSubmitted(true);

    console.log("User answers:", selectedAnswers);
  };

  const handleRetake = () => {
    var resetObj = {};
    setSelectedAnswers(resetObj);
    setSubmitted(false);
  };

  useEffect(() => {
    console.log("Selected answers changed:", selectedAnswers);
  }, [selectedAnswers]);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/quiz/download`,
        {
          quiz,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(res.data);

      const link = document.createElement("a");
      link.href = url;

   
      link.download = "file.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }

    setDownloading(false);
  };

  return (
    <div className="mt-20 max-w-2xl mx-auto">
      <h1 className="text-black text-2xl font-semibold mb-4">Questions</h1>

      {quiz?.map((question, idx) => (
        <QuizCard
          key={idx} 
          question={question.question}
          choices={question.choices}
          answer={question.answer}
          index={idx}
          submitted={submitted}
          selectedOption={selectedAnswers[question.id] ?? null}
          onSelect={(optionIdx: number) =>
            handleSelect(question.id, optionIdx)
          }
        />
      ))}

      <div className="flex pb-4 justify-between gap-2 items-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="text-blue-600 cursor-pointer font-medium hover:underline transition disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {downloading ? "Downloading..." : "Download Quiz"}
        </button>

        <div className="flex gap-2 items-center">
          <button
            className="mt-4 px-4 py-2 cursor-pointer rounded-lg bg-[#7C3AED] text-white text-[1rem] shadow-md disabled:bg-gray-300 disabled:text-gray-400 transition"
            onClick={handleRetake}
            disabled={!submitted}
          >
            Retake
          </button>

          <button
            className="mt-4 px-4 py-2 cursor-pointer rounded-lg bg-[#7C3AED] text-white text-[1rem] shadow-md disabled:bg-gray-300 disabled:text-gray-400 transition"
            disabled={!allAnswered || submitted}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}