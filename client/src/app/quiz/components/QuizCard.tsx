import React from "react";
import QuizChoices from "./QuizChoices";

interface QuizCardProps {
  question: string;
  choices: string[];
  answer: number;
  index: number;
  submitted: boolean;
  selectedOption: number | null;
  onSelect: (optionIdx: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, choices, answer, index, submitted, selectedOption, onSelect }) => {
  const optionLabels = ["A", "B", "C", "D"];

 
  let borderColor = "border-gray-300";
  if (submitted && selectedOption !== null) {
    borderColor = selectedOption === answer ? "border-green-600" : "border-red-600";
  }

  return (
    <div className={`bg-white rounded-xl border-[1px] ${borderColor} p-6 mb-6`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="flex items-center justify-center p-1 px-3 rounded-full border-2 border-black text-black font-bold text-lg">
          {index + 1}
        </div>
        <h2 className="font-semibold text-lg text-[#1B3C53] leading-snug">
          {question}
        </h2>
      </div>
      <QuizChoices
        choices={choices}
        answer={answer}
        submitted={submitted}
        selectedOption={selectedOption}
        onSelect={onSelect}
        optionLabels={optionLabels}
      />
      <p className={`mt-6 text-[1rem] ${submitted && selectedOption!==answer ? 'block' : 'hidden'} text-green-600`}>
        Correct Answer:<span className="font-semibold"> Option {optionLabels[answer]}</span>
      </p>
    </div>
  );
};

export default QuizCard;
