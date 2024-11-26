import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];

export const authService = {
  async signIn({ email, password }: { email: string; password: string }) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;
    return { user: userData, session: authData.session };
  },

  async signUp({ email, password, name, role }: { 
    email: string; 
    password: string;
    name: string;
    role: 'admin' | 'student';
  }) {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Then create the user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        department: 'Diretoria',
        position: 'Diretor',
      })
      .select()
      .single();

    if (userError) {
      // Rollback auth user creation if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }

    return { user: userData, session: authData.session };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    await this.updateProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
  },

  async createInitialAdmin() {
    const email = 'diegodemontevpj@gmail.com';
    const password = 'admin123'; // You should change this immediately after first login

    // Check if admin already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    return this.signUp({
      email,
      password,
      name: 'Diego Monte',
      role: 'admin',
    });
  }
};