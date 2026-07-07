import API from "./api";

interface AuditLog {
  _id: string;
  user: {
    name: string;
    email: string;
  } | null;
  action: string;
  details: string;
  timestamp: string;
}

interface ApiResponse {
  data: AuditLog[];
}

export const getAuditLogs = () => API.get<ApiResponse>("/audit-logs");