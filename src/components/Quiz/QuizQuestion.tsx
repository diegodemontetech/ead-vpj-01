import React from 'react';
import { Question } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  selectedOption: number | null;
  isSubmitted: boolean;
  onSelectOption: (optionIndex: number) => void;
  questionNumber: number;
}

export const QuizQuestion = ({
  question,
  selectedOption,
  isSubmitted,
  onSelectOption,
  questionNumber,
}: QuizQuestionProps) => {
  const isCorrect = isSubmitted && selectedOption === question.correctOption;
  const isWrong = isSubmitted && selectedOption !== null && !isCorrect;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
          {questionNumber}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isSubmitted && onSelectOption(index)}
                disabled={isSubmitted}
                className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                  selectedOption === index
                    ? isSubmitted
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                    : isSubmitted && index === question.correctOption
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex-1 text-left">
                  <span className={`text-sm font-medium ${
                    selectedOption === index
                      ? isSubmitted
                        ? isCorrect
                          ? 'text-green-700'
                          : 'text-red-700'
                        : 'text-blue-700'
                      : isSubmitted && index === question.correctOption
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </div>
                {isSubmitted && (
                  <div className="ml-3">
                    {index === question.correctOption ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : selectedOption === index ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};