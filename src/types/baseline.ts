import { SecurityProcess, NetworkPort, StartupItem, FileIntegrityCheck } from './security';

export interface BaselineMetrics {
  total_processes: number;
  total_ports: number;
  total_startup_items: number;
  total_files: number;
  safe_processes: number;
  safe_ports: number;
}

export interface Baseline {
  id: number;
  name: string;
  description: string;
  created_at: string;
  is_active: boolean;
  metrics: BaselineMetrics;
  processes?: SecurityProcess[];
  ports?: NetworkPort[];
  startup_items?: StartupItem[];
  file_integrity?: FileIntegrityCheck[];
}

export interface BaselineSummary {
  id: number;
  name: string;
  description: string;
  created_at: string;
  is_active: boolean;
  metrics: BaselineMetrics;
}

export interface ComparisonDifferences {
  processes: {
    added: SecurityProcess[];
    removed: SecurityProcess[];
    unchanged: number;
  };
  ports: {
    added: NetworkPort[];
    removed: NetworkPort[];
    unchanged: number;
  };
  startup_items: {
    added: StartupItem[];
    removed: StartupItem[];
    unchanged: number;
  };
  summary: {
    new_processes: number;
    removed_processes: number;
    new_ports: number;
    closed_ports: number;
    new_startup: number;
    removed_startup: number;
    risk_score: number;
    risk_level: 'safe' | 'low' | 'medium' | 'high';
  };
}

export interface BaselineComparison {
  baseline: {
    id: number;
    name: string;
    created_at: string;
  };
  compared_at: string;
  differences: ComparisonDifferences;
}
