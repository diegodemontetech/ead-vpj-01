import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type News = Database['public']['Tables']['news']['Row'];

export const newsService = {
  async getNews(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('news')
      .select(`
        *,
        author:users(id, name, avatar_url),
        tags:news_tags(tag)
      `, { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  },

  async getFeaturedNews() {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        author:users(id, name, avatar_url),
        tags:news_tags(tag)
      `)
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data;
  },

  async getNewsById(newsId: string) {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        author:users(id, name, avatar_url),
        tags:news_tags(tag)
      `)
      .eq('id', newsId)
      .single();

    if (error) throw error;
    return data;
  }
};