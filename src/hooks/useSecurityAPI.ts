import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScanResults, SecurityProcess, NetworkPort, StartupItem, FileIntegrityCheck } from '@/types/security';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SystemInfo {
  os: string;
  os_version: string;
  architecture: string;
  hostname: string;
}

export function useQuickScan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<ScanResults> => {
      const response = await fetch(`${API_BASE_URL}/api/scan/quick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanResults'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: error.message || "Could not connect to backend server. Make sure it's running on port 8000.",
      });
    },
  });
}

export function useFullScan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<ScanResults> => {
      const response = await fetch(`${API_BASE_URL}/api/scan/full`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanResults'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Full Scan Failed",
        description: error.message || "Could not connect to backend server. Make sure it's running on port 8000.",
      });
    },
  });
}

export function useSystemInfo() {
  return useQuery<SystemInfo>({
    queryKey: ['systemInfo'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/system/info`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch system info');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProcesses() {
  return useQuery<SecurityProcess[]>({
    queryKey: ['processes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/processes`);
      if (!response.ok) throw new Error('Failed to fetch processes');
      return response.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
}

export function usePorts() {
  return useQuery<NetworkPort[]>({
    queryKey: ['ports'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/ports`);
      if (!response.ok) throw new Error('Failed to fetch ports');
      return response.json();
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });
}

export function useStartupItems() {
  return useQuery<StartupItem[]>({
    queryKey: ['startup'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/startup`);
      if (!response.ok) throw new Error('Failed to fetch startup items');
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
}

export function useFileIntegrity() {
  return useQuery<FileIntegrityCheck[]>({
    queryKey: ['fileIntegrity'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/integrity`);
      if (!response.ok) throw new Error('Failed to fetch file integrity data');
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
}

export function useBackendHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Backend is not responding');
      return response.json();
    },
    retry: 1,
    retryDelay: 500,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000,
  });
}
