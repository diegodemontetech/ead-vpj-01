export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  groupIds: string[];
  avatar?: string;
  bio?: string;
  phone?: string;
  company?: string;
  position?: string;
  completedCourses: number;
  averageGrade: number;
  totalScore: number;
  lastActive: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  permissions: {
    courses: string[];
    features: ('certificates' | 'ranking' | 'news')[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  modules: Module[];
  groupIds: string[];
  createdAt: string;
  updatedAt: string;
  students: number;
  rating: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  lessons: Lesson[];
  exam: Exam | null;
  order: number;
  requiredForCompletion: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  attachments: Attachment[];
  completed: boolean;
  order: number;
  thumbnail?: string;
  requiredForCompletion: boolean;
}

export interface Attachment {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'other';
  size: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  minScore: number;
  userScore?: number;
  completed: boolean;
  timeLimit?: number;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  completionDate: string;
  grade: number;
  duration: number;
  validUntil?: string;
  metadata: {
    courseTitle: string;
    userName: string;
    instructorName: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: 'announcement' | 'update' | 'event';
  publishedAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  featured: boolean;
  tags: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'course_completed' | 'new_course' | 'achievement' | 'news';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata: Record<string, any>;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'course_completion' | 'perfect_score' | 'streak';
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  watchTime: number;
  lastPosition: number;
  updatedAt: string;
}