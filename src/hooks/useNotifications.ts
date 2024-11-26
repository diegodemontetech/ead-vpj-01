import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';
import { useAuthStore } from '../store/useAuthStore';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationsService.getNotifications(user?.id!),
    enabled: !!user,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', user?.id]);
    },
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(user?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', user?.id]);
    },
  });

  return {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}