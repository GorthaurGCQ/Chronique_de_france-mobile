import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';
import { useAuth } from './useAuth';

export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
    enabled: isAuthenticated,
  });
}

export function useProfileHistory() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile-history'],
    queryFn: profileApi.getHistory,
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      profileApi.changePassword(currentPassword, newPassword),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => profileApi.uploadAvatar(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}
