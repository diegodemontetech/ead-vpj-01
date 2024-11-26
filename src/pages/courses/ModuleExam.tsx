import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { QuizQuestion } from '../../components/Quiz/QuizQuestion';
import { useParams } from 'react-router-dom';
import { Award, AlertCircle } from 'lucide-react';

export const ModuleExam = () => {
  const { moduleId } = useParams();
  const [selectedAnswers, setSelectedAnswers] = React.useState<(number | null)[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState<number | null>(null);

  const exam = {
    id: '1',
    title: 'Avaliação: Introdução à Gestão de Pastagens',
    description: 'Avalie seu conhecimento sobre os conceitos básicos de gestão de pastagens.',
    minScore: 7,
    questions: [
      {
        id: '1',
        text: 'Qual é o principal objetivo da rotação de pastagens?',
        options: [
          'Aumentar a área de pastagem',
          'Permitir a recuperação do pasto',
          'Reduzir custos de manutenção',
          'Simplificar o manejo do gado'
        ],
        correctOption: 1
      },
      {
        id: '2',
        text: 'Qual fator é mais importante na escolha do tipo de pastagem?',
        options: [
          'Clima da região',
          'Custo de implementação',
          'Preferência do produtor',
          'Tamanho da propriedade'
        ],
        correctOption: 0
      },
      // Add more questions as needed
    ]
  };

  React.useEffect(() => {
    setSelectedAnswers(new Array(exam.questions.length).fill(null));
  }, [exam.questions.length]);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === exam.questions[index].correctOption ? 1 : 0);
    }, 0);
    return (correctAnswers / exam.questions.length) * 10;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const allQuestionsAnswered = selectedAnswers.every((answer) => answer !== null);
  const passed = score !== null && score >= exam.minScore;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto pb-12">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {exam.title}
          </h1>
          <p className="text-gray-600 mb-4">{exam.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Nota mínima para aprovação: {exam.minScore}</span>
          </div>
        </div>

        {isSubmitted && score !== null ? (
          <div className={`mb-8 p-6 rounded-lg ${
            passed ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center">
              <Award className={`w-8 h-8 mr-4 ${
                passed ? 'text-green-500' : 'text-red-500'
              }`} />
              <div>
                <h2 className={`text-lg font-semibold ${
                  passed ? 'text-green-800' : 'text-red-800'
                }`}>
                  {passed ? 'Parabéns! Você foi aprovado!' : 'Não foi dessa vez.'}
                </h2>
                <p className={`text-sm ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  Sua nota: {score.toFixed(1)} / 10.0
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              selectedOption={selectedAnswers[index]}
              isSubmitted={isSubmitted}
              onSelectOption={(optionIndex) => handleSelectOption(index, optionIndex)}
              questionNumber={index + 1}
            />
          ))}
        </div>

        {!isSubmitted && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className={`btn ${
                !allQuestionsAnswered
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              Enviar Respostas
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};