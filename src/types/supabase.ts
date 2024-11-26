export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          title: string
          type: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          title: string
          type: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          title?: string
          type?: string
          unlocked_at?: string
          user_id?: string
        }
      }
      attachments: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          size: number
          title: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          size: number
          title: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          size?: number
          title?: string
          type?: string
          url?: string
        }
      }
      certificates: {
        Row: {
          completion_date: string
          course_id: string
          created_at: string
          duration: number
          grade: number
          id: string
          metadata: Json
          user_id: string
          valid_until: string | null
        }
        Insert: {
          completion_date: string
          course_id: string
          created_at?: string
          duration: number
          grade: number
          id?: string
          metadata?: Json
          user_id: string
          valid_until?: string | null
        }
        Update: {
          completion_date?: string
          course_id?: string
          created_at?: string
          duration?: number
          grade?: number
          id?: string
          metadata?: Json
          user_id?: string
          valid_until?: string | null
        }
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: number
          id: string
          instructor_id: string
          level: string
          prerequisites: Json
          rating: number
          students_count: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          instructor_id: string
          level: string
          prerequisites?: Json
          rating?: number
          students_count?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          instructor_id?: string
          level?: string
          prerequisites?: Json
          rating?: number
          students_count?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
      }
      ebooks: {
        Row: {
          author: string
          category: string
          created_at: string
          description: string | null
          downloads: number
          id: string
          pdf_url: string
          published_at: string
          release_year: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          created_at?: string
          description?: string | null
          downloads?: number
          id?: string
          pdf_url: string
          published_at?: string
          release_year: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          description?: string | null
          downloads?: number
          id?: string
          pdf_url?: string
          published_at?: string
          release_year?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
      }
      exam_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          exam_id: string
          id: string
          score: number | null
          started_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          exam_id: string
          id?: string
          score?: number | null
          started_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          exam_id?: string
          id?: string
          score?: number | null
          started_at?: string
          user_id?: string
        }
      }
      exams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_attempts: number
          min_score: number
          module_id: string
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_attempts?: number
          min_score: number
          module_id: string
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_attempts?: number
          min_score?: number
          module_id?: string
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
      }
      group_permissions: {
        Row: {
          created_at: string
          group_id: string
          id: string
          permission: string
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          permission: string
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          permission?: string
          resource_id?: string | null
          resource_type?: string
        }
      }
      groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          module_id: string
          order_index: number
          required_for_completion: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          module_id: string
          order_index: number
          required_for_completion?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          module_id?: string
          order_index?: number
          required_for_completion?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration: number
          id: string
          order_index: number
          required_for_completion: boolean
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          order_index: number
          required_for_completion?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          order_index?: number
          required_for_completion?: boolean
          title?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          featured: boolean
          id: string
          image_url: string | null
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published_at?: string
          title?: string
          updated_at?: string
        }
      }
      news_tags: {
        Row: {
          news_id: string
          tag: string
        }
        Insert: {
          news_id: string
          tag: string
        }
        Update: {
          news_id?: string
          tag?: string
        }
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
      }
      questions: {
        Row: {
          correct_option: number
          created_at: string
          exam_id: string
          explanation: string | null
          id: string
          options: Json
          order_index: number
          text: string
        }
        Insert: {
          correct_option: number
          created_at?: string
          exam_id: string
          explanation?: string | null
          id?: string
          options: Json
          order_index: number
          text: string
        }
        Update: {
          correct_option?: number
          created_at?: string
          exam_id?: string
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          text?: string
        }
      }
      user_groups: {
        Row: {
          created_at: string
          group_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          user_id?: string
        }
      }
      user_progress: {
        Row: {
          completed: boolean
          id: string
          last_position: number
          lesson_id: string
          updated_at: string
          user_id: string
          watch_time: number
        }
        Insert: {
          completed?: boolean
          id?: string
          last_position?: number
          lesson_id: string
          updated_at?: string
          user_id: string
          watch_time?: number
        }
        Update: {
          completed?: boolean
          id?: string
          last_position?: number
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watch_time?: number
        }
      }
      users: {
        Row: {
          average_grade: number
          avatar_url: string | null
          bio: string | null
          company: string | null
          completed_courses: number
          created_at: string
          department: string | null
          email: string
          id: string
          last_active: string
          name: string
          phone: string | null
          position: string | null
          role: string
          total_score: number
          updated_at: string
        }
        Insert: {
          average_grade?: number
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          completed_courses?: number
          created_at?: string
          department?: string | null
          email: string
          id?: string
          last_active?: string
          name: string
          phone?: string | null
          position?: string | null
          role: string
          total_score?: number
          updated_at?: string
        }
        Update: {
          average_grade?: number
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          completed_courses?: number
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          last_active?: string
          name?: string
          phone?: string | null
          position?: string | null
          role?: string
          total_score?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}