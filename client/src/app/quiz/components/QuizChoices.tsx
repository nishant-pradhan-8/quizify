import React from "react";

interface QuizChoicesProps {
  choices: string[];
  answer: number;
  submitted: boolean;
  selectedOption: number | null;
  onSelect: (optionIdx: number) => void;
  optionLabels: string[];
}

const QuizChoices: React.FC<QuizChoicesProps> = ({ choices, answer, submitted, selectedOption, onSelect, optionLabels }) => (
  <div className="flex flex-col gap-3 mt-2">
    {choices.map((choice, idx) => {
      const isSelected = selectedOption === idx;
      let optionClass = '';
      if (submitted && isSelected) {
        optionClass = selectedOption === answer
          ? 'border-green-600 bg-green-50 text-green-700'
          : 'border-red-600 bg-red-50 text-red-700';
      } else if (isSelected) {
        optionClass = 'border-[#7C3AED] bg-[#FBFBFB] text-[#7C3AED]';
      } else {
        optionClass = 'border-gray-200 bg-[#FBFBFB] text-gray-700';
      }
      let circleClass = '';
      if (submitted && isSelected) {
        circleClass = selectedOption === answer
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white';
      } else if (isSelected) {
        circleClass = 'bg-purple-500 text-white';
      } else {
        circleClass = 'bg-gray-200 text-gray-700';
      }
      return (
        <button
          key={optionLabels[idx]}
          type="button"
          className={`flex cursor-pointer items-start gap-3 rounded-lg px-4 py-3 border transition-all text-left ${optionClass}`}
          onClick={() => onSelect(idx)}
          disabled={submitted}
        >
          <span className={`font-bold w-5 h-5 flex items-center justify-center rounded-full ${circleClass}`}>
            {optionLabels[idx]}
          </span>
          <span className="flex-1">{choice}</span>
        </button>
      );
    })}
  </div>
);

export default QuizChoices; 