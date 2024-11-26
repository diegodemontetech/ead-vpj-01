import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useCourse } from '../../hooks/useCourses';
import { useAuthStore } from '../../store/useAuthStore';
import { VideoPlayer } from '../../components/VideoPlayer';
import { storageService } from '../../services/storage.service';

export function LessonView() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { course } = useCourse(courseId!);
  const { user } = useAuthStore();
  const [currentLesson, setCurrentLesson] = React.useState<any>(null);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [navigation, setNavigation] = React.useState<{
    previousLesson: { moduleId: string; lessonId: string } | null;
    nextLesson: { moduleId: string; lessonId: string } | null;
  }>({
    previousLesson: null,
    nextLesson: null
  });

  // Set up navigation when course data is available
  React.useEffect(() => {
    if (!course) return;

    let foundCurrentLesson = false;
    let previousLesson = null;
    let nextLesson = null;
    let currentLessonData = null;

    // Flatten all lessons for easier navigation
    const allLessons = course.modules.reduce((acc: any[], module: any) => {
      return acc.concat(
        module.lessons.map((lesson: any) => ({
          ...lesson,
          moduleId: module.id
        }))
      );
    }, []);

    // Sort lessons by module order and lesson order
    allLessons.sort((a: any, b: any) => {
      const moduleA = course.modules.find((m: any) => m.id === a.moduleId);
      const moduleB = course.modules.find((m: any) => m.id === b.moduleId);
      if (moduleA.order_index !== moduleB.order_index) {
        return moduleA.order_index - moduleB.order_index;
      }
      return a.order_index - b.order_index;
    });

    // Find current, previous, and next lessons
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      
      if (lesson.id === lessonId) {
        foundCurrentLesson = true;
        currentLessonData = lesson;
        
        if (i > 0) {
          const prev = allLessons[i - 1];
          previousLesson = {
            moduleId: prev.moduleId,
            lessonId: prev.id
          };
        }
        
        if (i < allLessons.length - 1) {
          const next = allLessons[i + 1];
          nextLesson = {
            moduleId: next.moduleId,
            lessonId: next.id
          };
        }
        
        break;
      }
    }

    setCurrentLesson(currentLessonData);
    setNavigation({ previousLesson, nextLesson });
  }, [course, lessonId]);

  const handleVideoProgress = (progress: number) => {
    // Update progress in Supabase
    if (user && currentLesson) {
      // Update progress every 5%
      if (Math.floor(progress) % 5 === 0) {
        supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            lesson_id: currentLesson.id,
            progress: progress,
            last_watched: new Date().toISOString()
          })
          .single();
      }
    }
  };

  const handleVideoComplete = async () => {
    if (!isCompleted && user && currentLesson) {
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            lesson_id: currentLesson.id,
            completed: true,
            progress: 100,
            last_watched: new Date().toISOString()
          })
          .single();

        if (error) throw error;

        setIsCompleted(true);

        // Auto-navigate to next lesson after a short delay
        if (navigation.nextLesson) {
          setTimeout(() => {
            navigate(`/courses/${courseId}/modules/${navigation.nextLesson.moduleId}/lessons/${navigation.nextLesson.lessonId}`);
          }, 2000);
        }
      } catch (error) {
        console.error('Error marking lesson as completed:', error);
      }
    }
  };

  if (!currentLesson) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const videoUrl = storageService.getVideoUrl(courseId!, currentLesson.id);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar ao curso
          </button>
          <div className="flex items-center gap-4">
            {navigation.previousLesson && (
              <button
                onClick={() => navigate(`/courses/${courseId}/modules/${navigation.previousLesson.moduleId}/lessons/${navigation.previousLesson.lessonId}`)}
                className="btn-secondary flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Aula Anterior
              </button>
            )}
            {navigation.nextLesson && (
              <button
                onClick={() => navigate(`/courses/${courseId}/modules/${navigation.nextLesson.moduleId}/lessons/${navigation.nextLesson.lessonId}`)}
                className="btn-secondary flex items-center"
                disabled={!isCompleted}
              >
                Próxima Aula
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Video Player */}
          <div className="bg-[#1F1F1F] rounded-lg shadow-sm overflow-hidden">
            <VideoPlayer
              src={videoUrl}
              poster={currentLesson.thumbnail_url}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
            />
          </div>

          {/* Content and Materials */}
          <div className="grid grid-cols-1 gap-6">
            {/* Lesson Content */}
            <div className="bg-[#1F1F1F] rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-white mb-4">
                {currentLesson.title}
              </h1>
              <div 
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: currentLesson.description || '' }}
              />
            </div>

            {/* Materials */}
            {currentLesson.attachments && currentLesson.attachments.length > 0 && (
              <div className="bg-[#1F1F1F] rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Material de Apoio
                </h2>
                <div className="flex flex-wrap gap-4">
                  {currentLesson.attachments.map((attachment: any) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      className="flex items-center p-3 bg-[#2F2F2F] rounded-lg hover:bg-[#3F3F3F] transition-colors min-w-[250px] flex-1"
                    >
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {attachment.title}
                        </p>
                        <p className="text-xs text-gray-400 uppercase">
                          {attachment.type}
                        </p>
                      </div>
                      <Download className="w-5 h-5 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Completion Status */}
          {isCompleted && (
            <div className="bg-green-900/20 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-400">Aula concluída!</span>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}