import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress } from '../types';

interface ProgressState {
  progress: Record<string, UserProgress>;
  updateProgress: (progress: UserProgress) => void;
  getProgress: (courseId: string, lessonId: string) => UserProgress | undefined;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  canTakeExam: (courseId: string, moduleId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      updateProgress: (progress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [`${progress.courseId}-${progress.lessonId}`]: progress,
          },
        })),
      getProgress: (courseId, lessonId) =>
        get().progress[`${courseId}-${lessonId}`],
      isLessonCompleted: (courseId, lessonId) =>
        get().progress[`${courseId}-${lessonId}`]?.completed ?? false,
      canTakeExam: (courseId, moduleId) => {
        const progressEntries = Object.values(get().progress);
        const moduleLessons = progressEntries.filter(
          (p) => p.courseId === courseId && p.moduleId === moduleId
        );
        return moduleLessons.every((p) => p.completed);
      },
    }),
    {
      name: 'progress-storage',
    }
  )
);