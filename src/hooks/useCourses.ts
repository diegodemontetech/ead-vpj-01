import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '../services/courses.service';
import { useAuthStore } from '../store/useAuthStore';

export function useCourses() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.getCourses,
  });

  const { mutateAsync: createCourse } = useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
    },
  });

  const { mutateAsync: uploadThumbnail } = useMutation({
    mutationFn: ({ courseId, file }: { courseId: string; file: File }) =>
      coursesService.uploadThumbnail(courseId, file),
  });

  return {
    courses,
    isLoading,
    createCourse,
    uploadThumbnail,
  };
}

export function useCourse(courseId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => coursesService.getCourseById(courseId),
  });

  const { mutate: updateProgress } = useMutation({
    mutationFn: (progress: Parameters<typeof coursesService.updateProgress>[2]) =>
      coursesService.updateProgress(user?.id!, courseId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries(['courseProgress', user?.id]);
    },
  });

  return {
    course,
    isLoading,
    updateProgress,
  };
}