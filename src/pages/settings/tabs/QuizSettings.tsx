import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash } from 'lucide-react';

const questionSchema = z.object({
  text: z.string().min(1, 'Pergunta é obrigatória'),
  options: z.array(z.string()).min(2, 'Mínimo de 2 opções'),
  correctOption: z.number(),
  explanation: z.string().optional(),
});

const examSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string(),
  moduleId: z.string(),
  timeLimit: z.number().optional(),
  minScore: z.number().min(0).max(10),
  maxAttempts: z.number().min(1),
  questions: z.array(questionSchema).min(1, 'Adicione pelo menos uma questão'),
});

type ExamFormData = z.infer<typeof examSchema>;

export const QuizSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      questions: [{ text: '', options: ['', ''], correctOption: 0 }],
      maxAttempts: 1,
      minScore: 7,
    },
  });

  const questions = watch('questions');

  const addQuestion = () => {
    setValue('questions', [
      ...questions,
      { text: '', options: ['', ''], correctOption: 0 },
    ]);
  };

  const removeQuestion = (index: number) => {
    setValue(
      'questions',
      questions.filter((_, i) => i !== index)
    );
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setValue('questions', newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setValue('questions', newQuestions);
  };

  const onSubmit = async (data: ExamFormData) => {
    try {
      // Here you would typically make an API call to save the exam
      console.log('Form data:', data);
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Criar Nova Avaliação
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Título da Avaliação
              </label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Módulo
              </label>
              <select
                {...register('moduleId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um módulo</option>
                <option value="1">Módulo 1</option>
                <option value="2">Módulo 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tempo Limite (minutos)
              </label>
              <input
                type="number"
                {...register('timeLimit', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nota Mínima (0-10)
              </label>
              <input
                type="number"
                {...register('minScore', { valueAsNumber: true })}
                min="0"
                max="10"
                step="0.5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tentativas Permitidas
              </label>
              <input
                type="number"
                {...register('maxAttempts', { valueAsNumber: true })}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Questões</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Questão
              </button>
            </div>

            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-900">
                    Questão {questionIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    {...register(`questions.${questionIndex}.text`)}
                    placeholder="Digite a pergunta"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  {question.options.map((_, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        {...register(`questions.${questionIndex}.correctOption`)}
                        value={optionIndex}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        {...register(
                          `questions.${questionIndex}.options.${optionIndex}`
                        )}
                        placeholder={`Opção ${optionIndex + 1}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    + Adicionar opção
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Explicação (opcional)
                  </label>
                  <textarea
                    {...register(`questions.${questionIndex}.explanation`)}
                    rows={2}
                    placeholder="Explique por que esta é a resposta correta"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};