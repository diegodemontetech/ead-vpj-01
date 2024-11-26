import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Group = Database['public']['Tables']['groups']['Row'];
type GroupPermission = Database['public']['Tables']['group_permissions']['Row'];

export const groupsService = {
  async getGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        permissions:group_permissions(*),
        users:user_groups(user_id)
      `);

    if (error) throw error;
    return data;
  },

  async getGroupById(groupId: string) {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        permissions:group_permissions(*),
        users:user_groups(
          user:users(id, name, avatar_url)
        )
      `)
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data;
  },

  async createGroup(group: Partial<Group>, permissions: Partial<GroupPermission>[]) {
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert(group)
      .select()
      .single();

    if (groupError) throw groupError;

    if (permissions.length > 0) {
      const { error: permissionsError } = await supabase
        .from('group_permissions')
        .insert(
          permissions.map(p => ({ ...p, group_id: groupData.id }))
        );

      if (permissionsError) throw permissionsError;
    }

    return groupData;
  },

  async updateGroupPermissions(groupId: string, permissions: Partial<GroupPermission>[]) {
    const { error: deleteError } = await supabase
      .from('group_permissions')
      .delete()
      .eq('group_id', groupId);

    if (deleteError) throw deleteError;

    if (permissions.length > 0) {
      const { error: insertError } = await supabase
        .from('group_permissions')
        .insert(
          permissions.map(p => ({ ...p, group_id: groupId }))
        );

      if (insertError) throw insertError;
    }
  }
};