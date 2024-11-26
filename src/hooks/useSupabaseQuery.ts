import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

type QueryOptions = {
  key: string[];
  query: () => PostgrestFilterBuilder<any, any, any>;
  enabled?: boolean;
};

type MutationOptions<TData> = {
  key: string[];
  mutation: (data: TData) => Promise<any>;
};

export function useSupabaseQuery<TData = any>({ key, query, enabled = true }: QueryOptions) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await query();
      if (error) throw error;
      return data as TData;
    },
    enabled,
  });
}

export function useSupabaseMutation<TData = any, TVariables = any>({
  key,
  mutation,
}: MutationOptions<TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}