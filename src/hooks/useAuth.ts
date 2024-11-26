import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, login, logout } = useAuthStore();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!user,
  });

  const { mutate: signIn } = useMutation({
    mutationFn: authService.signIn,
    onSuccess: ({ user, session }) => {
      login(user, session.access_token);
    },
  });

  const { mutate: signUp } = useMutation({
    mutationFn: authService.signUp,
    onSuccess: ({ user, session }) => {
      login(user, session.access_token);
    },
  });

  const { mutate: signOut } = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: (updates: Parameters<typeof authService.updateProfile>[1]) =>
      authService.updateProfile(user?.id!, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });

  const { mutate: uploadAvatar } = useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(user?.id!, file),
    onSuccess: (avatarUrl) => {
      queryClient.setQueryData(['currentUser'], (old: any) => ({
        ...old,
        avatar_url: avatarUrl,
      }));
    },
  });

  return {
    user: currentUser,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
  };
}