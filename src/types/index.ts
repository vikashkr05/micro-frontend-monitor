export type ModuleStatus = "healthy" | "degraded" | "failing" | "unknown";

export interface MFEModule {
  id: string;
  name: string;
  team: string;
  currentVersion: string;
  latestVersion: string;
  status: ModuleStatus;
  loadTimeMs: number;
  errorRate: number; // 0–1
  lastDeployedAt: number; // timestamp
  loadHistory: { timestamp: number; loadTimeMs: number; success: boolean }[];
  exposedComponents: string[];
  consumers: string[]; // names of other MFEs that consume this
}

export interface LoadEvent {
  id: string;
  moduleId: string;
  moduleName: string;
  timestamp: number;
  loadTimeMs: number;
  success: boolean;
  error?: string;
  route: string;
}

export type SortField = "name" | "loadTimeMs" | "errorRate" | "lastDeployedAt";
