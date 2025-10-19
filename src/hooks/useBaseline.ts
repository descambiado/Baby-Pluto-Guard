import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Baseline, BaselineSummary, BaselineComparison } from '@/types/baseline';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useCreateBaseline() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/baseline/create?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description || '')}`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to create baseline');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baselines'] });
      queryClient.invalidateQueries({ queryKey: ['activeBaseline'] });
    },
  });
}

export function useActiveBaseline() {
  return useQuery<{ exists: boolean; baseline?: Baseline; message?: string }>({
    queryKey: ['activeBaseline'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/baseline/active`);
      if (!response.ok) throw new Error('Failed to fetch active baseline');
      return response.json();
    },
    staleTime: 30000,
  });
}

export function useBaselines() {
  return useQuery<{ baselines: BaselineSummary[]; count: number }>({
    queryKey: ['baselines'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/baseline/list`);
      if (!response.ok) throw new Error('Failed to fetch baselines');
      return response.json();
    },
    staleTime: 30000,
  });
}

export function useBaseline(baselineId: number | null) {
  return useQuery<Baseline>({
    queryKey: ['baseline', baselineId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/baseline/${baselineId}`);
      if (!response.ok) throw new Error('Failed to fetch baseline');
      return response.json();
    },
    enabled: !!baselineId,
  });
}

export function useActivateBaseline() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (baselineId: number) => {
      const response = await fetch(
        `${API_BASE_URL}/api/baseline/${baselineId}/activate`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to activate baseline');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baselines'] });
      queryClient.invalidateQueries({ queryKey: ['activeBaseline'] });
    },
  });
}

export function useDeleteBaseline() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (baselineId: number) => {
      const response = await fetch(
        `${API_BASE_URL}/api/baseline/${baselineId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) throw new Error('Failed to delete baseline');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baselines'] });
      queryClient.invalidateQueries({ queryKey: ['activeBaseline'] });
    },
  });
}

export function useCompareWithBaseline() {
  return useMutation({
    mutationFn: async (baselineId?: number) => {
      const url = baselineId
        ? `${API_BASE_URL}/api/baseline/compare?baseline_id=${baselineId}`
        : `${API_BASE_URL}/api/baseline/compare`;
      
      const response = await fetch(url, { method: 'POST' });
      
      if (!response.ok) throw new Error('Failed to compare with baseline');
      return response.json() as Promise<BaselineComparison>;
    },
  });
}
