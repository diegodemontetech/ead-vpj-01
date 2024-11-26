import { supabase } from '../lib/supabase';
import { storageService } from './storage.service';
import type { Database } from '../types/supabase';

type Course = Database['public']['Tables']['courses']['Row'];

export const coursesService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCourse(courseData: Partial<Course>, thumbnail?: File) {
    try {
      // First create the course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          category: courseData.category,
          level: courseData.level,
          prerequisites: courseData.prerequisites || [],
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // If there's a thumbnail, upload it
      if (thumbnail && course) {
        const thumbnailUrl = await storageService.uploadCourseThumbnail(thumbnail, course.id);

        // Update course with thumbnail URL
        const { error: updateError } = await supabase
          .from('courses')
          .update({ thumbnail_url: thumbnailUrl })
          .eq('id', course.id);

        if (updateError) throw updateError;

        return { ...course, thumbnail_url: thumbnailUrl };
      }

      return course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  async updateCourse(courseId: string, courseData: Partial<Course>, thumbnail?: File) {
    try {
      let thumbnailUrl = courseData.thumbnail_url;

      // If there's a new thumbnail, upload it
      if (thumbnail) {
        thumbnailUrl = await storageService.uploadCourseThumbnail(thumbnail, courseId);
      }

      const { data, error } = await supabase
        .from('courses')
        .update({
          ...courseData,
          thumbnail_url: thumbnailUrl,
        })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};