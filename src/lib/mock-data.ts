import type { MFEModule, LoadEvent } from "../types";

const NOW = Date.now();
const DAY = 86400000;

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeHistory(base: number, ok: boolean) {
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: NOW - (20 - i) * 60000,
    loadTimeMs: base + rnd(-20, 40),
    success: ok ? Math.random() > 0.05 : Math.random() > 0.55,
  }));
}

export const MODULES: MFEModule[] = [
  {
    id: "mfe-shell",
    name: "Shell App",
    team: "Platform",
    currentVersion: "2.4.1",
    latestVersion: "2.4.1",
    status: "healthy",
    loadTimeMs: 42,
    errorRate: 0.01,
    lastDeployedAt: NOW - DAY * 1,
    loadHistory: makeHistory(42, true),
    exposedComponents: ["AppShell", "GlobalNav", "AuthGuard"],
    consumers: [],
  },
  {
    id: "mfe-dashboard",
    name: "Dashboard",
    team: "Analytics",
    currentVersion: "1.8.3",
    latestVersion: "1.9.0",
    status: "degraded",
    loadTimeMs: 310,
    errorRate: 0.12,
    lastDeployedAt: NOW - DAY * 5,
    loadHistory: makeHistory(310, false),
    exposedComponents: ["DashboardPage", "MetricsWidget", "ChartPanel"],
    consumers: ["Shell App", "Reporting"],
  },
  {
    id: "mfe-user-mgmt",
    name: "User Management",
    team: "Identity",
    currentVersion: "3.1.0",
    latestVersion: "3.1.0",
    status: "healthy",
    loadTimeMs: 88,
    errorRate: 0.02,
    lastDeployedAt: NOW - DAY * 2,
    loadHistory: makeHistory(88, true),
    exposedComponents: ["UserTable", "RoleEditor", "InviteModal"],
    consumers: ["Shell App", "Settings"],
  },
  {
    id: "mfe-billing",
    name: "Billing",
    team: "Payments",
    currentVersion: "0.9.2",
    latestVersion: "1.0.0",
    status: "failing",
    loadTimeMs: 780,
    errorRate: 0.48,
    lastDeployedAt: NOW - DAY * 12,
    loadHistory: makeHistory(780, false),
    exposedComponents: ["BillingPage", "InvoiceList", "PaymentForm"],
    consumers: ["Shell App"],
  },
  {
    id: "mfe-notifications",
    name: "Notifications",
    team: "Platform",
    currentVersion: "1.2.1",
    latestVersion: "1.3.0",
    status: "degraded",
    loadTimeMs: 195,
    errorRate: 0.08,
    lastDeployedAt: NOW - DAY * 8,
    loadHistory: makeHistory(195, false),
    exposedComponents: ["NotifBell", "NotifPanel", "ToastProvider"],
    consumers: ["Shell App", "Dashboard", "User Management"],
  },
  {
    id: "mfe-reporting",
    name: "Reporting",
    team: "Analytics",
    currentVersion: "2.0.0",
    latestVersion: "2.0.0",
    status: "healthy",
    loadTimeMs: 124,
    errorRate: 0.03,
    lastDeployedAt: NOW - DAY * 3,
    loadHistory: makeHistory(124, true),
    exposedComponents: ["ReportBuilder", "ExportModal", "ScheduleReport"],
    consumers: ["Shell App"],
  },
  {
    id: "mfe-settings",
    name: "Settings",
    team: "Platform",
    currentVersion: "1.1.4",
    latestVersion: "1.2.0",
    status: "healthy",
    loadTimeMs: 67,
    errorRate: 0.01,
    lastDeployedAt: NOW - DAY * 4,
    loadHistory: makeHistory(67, true),
    exposedComponents: ["SettingsPage", "ThemeSelector", "APIKeyManager"],
    consumers: ["Shell App"],
  },
  {
    id: "mfe-search",
    name: "Global Search",
    team: "Discovery",
    currentVersion: "0.5.1",
    latestVersion: "0.7.0",
    status: "unknown",
    loadTimeMs: 0,
    errorRate: 0,
    lastDeployedAt: NOW - DAY * 21,
    loadHistory: [],
    exposedComponents: ["SearchBar", "SearchResults"],
    consumers: ["Shell App"],
  },
];

export function generateLoadEvents(count = 30): LoadEvent[] {
  const routes = ["/", "/dashboard", "/users", "/billing", "/reports", "/settings"];
  return Array.from({ length: count }, (_, i) => {
    const mod = MODULES[i % MODULES.length];
    const success = Math.random() > mod.errorRate;
    return {
      id: `evt-${i}`,
      moduleId: mod.id,
      moduleName: mod.name,
      timestamp: NOW - (count - i) * 8000 + rnd(-2000, 2000),
      loadTimeMs: success ? mod.loadTimeMs + rnd(-15, 30) : rnd(500, 2000),
      success,
      error: success ? undefined : "ChunkLoadError: Loading chunk failed",
      route: routes[i % routes.length],
    };
  });
}

export function getStatusCounts(modules: MFEModule[]) {
  return {
    healthy: modules.filter((m) => m.status === "healthy").length,
    degraded: modules.filter((m) => m.status === "degraded").length,
    failing: modules.filter((m) => m.status === "failing").length,
    unknown: modules.filter((m) => m.status === "unknown").length,
  };
}

export function versionDriftCount(modules: MFEModule[]) {
  return modules.filter((m) => m.currentVersion !== m.latestVersion).length;
}
