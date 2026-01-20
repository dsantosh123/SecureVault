// lib/admin/audit.ts
// Immutable Audit Logging System for Admin Actions

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  
  // Verification Actions
  APPROVE_VERIFICATION = 'APPROVE_VERIFICATION',
  REJECT_VERIFICATION = 'REJECT_VERIFICATION',
  REQUEST_DOCS = 'REQUEST_DOCS',
  VIEW_VERIFICATION = 'VIEW_VERIFICATION',
  
  // Document Actions
  VIEW_DOCUMENT = 'VIEW_DOCUMENT',
  
  // User Actions
  VIEW_USER = 'VIEW_USER',
  VIEW_USER_ACTIVITY = 'VIEW_USER_ACTIVITY',
  
  // System Configuration
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  UPDATE_PLAN_LIMITS = 'UPDATE_PLAN_LIMITS',
  
  // Admin Management
  CREATE_ADMIN = 'CREATE_ADMIN',
  DELETE_ADMIN = 'DELETE_ADMIN',
  UPDATE_ADMIN = 'UPDATE_ADMIN',
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  actionType: AuditAction;
  targetId: string;
  targetType: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface CreateAuditLogParams {
  adminId: string;
  adminEmail: string;
  actionType: AuditAction;
  targetId: string;
  targetType: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  status?: 'success' | 'failed';
  errorMessage?: string;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  params: CreateAuditLogParams
): Promise<AuditLogEntry> {
  const logEntry: AuditLogEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    adminId: params.adminId,
    adminEmail: params.adminEmail,
    actionType: params.actionType,
    targetId: params.targetId,
    targetType: params.targetType,
    details: params.details || {},
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: params.status || 'success',
    errorMessage: params.errorMessage,
  };

  // TODO: Save to database
  // await db.auditLogs.create(logEntry);
  
  console.log('[AUDIT LOG]', logEntry);
  
  return logEntry;
}

/**
 * Generate unique audit log ID
 */
function generateAuditId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `AUDIT-${timestamp}-${random}`;
}

/**
 * Log verification approval
 */
export async function logVerificationApproval(params: {
  adminId: string;
  adminEmail: string;
  verificationId: string;
  nomineeEmail: string;
  userId: string;
  assetId: string;
  adminNotes: string;
  ipAddress: string;
  userAgent: string;
}): Promise<AuditLogEntry> {
  return createAuditLog({
    adminId: params.adminId,
    adminEmail: params.adminEmail,
    actionType: AuditAction.APPROVE_VERIFICATION,
    targetId: params.verificationId,
    targetType: 'Verification',
    details: {
      nomineeEmail: params.nomineeEmail,
      userId: params.userId,
      assetId: params.assetId,
      adminNotes: params.adminNotes,
    },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: 'success',
  });
}

/**
 * Log verification rejection
 */
export async function logVerificationRejection(params: {
  adminId: string;
  adminEmail: string;
  verificationId: string;
  nomineeEmail: string;
  rejectionReason: string;
  adminNotes: string;
  ipAddress: string;
  userAgent: string;
}): Promise<AuditLogEntry> {
  return createAuditLog({
    adminId: params.adminId,
    adminEmail: params.adminEmail,
    actionType: AuditAction.REJECT_VERIFICATION,
    targetId: params.verificationId,
    targetType: 'Verification',
    details: {
      nomineeEmail: params.nomineeEmail,
      rejectionReason: params.rejectionReason,
      adminNotes: params.adminNotes,
    },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: 'success',
  });
}

/**
 * Log document view
 */
export async function logDocumentView(params: {
  adminId: string;
  adminEmail: string;
  documentId: string;
  documentType: string;
  verificationId: string;
  ipAddress: string;
  userAgent: string;
}): Promise<AuditLogEntry> {
  return createAuditLog({
    adminId: params.adminId,
    adminEmail: params.adminEmail,
    actionType: AuditAction.VIEW_DOCUMENT,
    targetId: params.documentId,
    targetType: params.documentType,
    details: {
      verificationId: params.verificationId,
      viewedAt: new Date().toISOString(),
    },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: 'success',
  });
}

/**
 * Log admin login
 */
export async function logAdminLogin(params: {
  adminId: string;
  adminEmail: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}): Promise<AuditLogEntry> {
  return createAuditLog({
    adminId: params.adminId || 'UNKNOWN',
    adminEmail: params.adminEmail,
    actionType: params.success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
    targetId: params.adminId || 'UNKNOWN',
    targetType: 'Admin',
    details: {
      loginTime: new Date().toISOString(),
    },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: params.success ? 'success' : 'failed',
    errorMessage: params.errorMessage,
  });
}

/**
 * Log system configuration change
 */
export async function logSystemConfigChange(params: {
  adminId: string;
  adminEmail: string;
  configKey: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  userAgent: string;
}): Promise<AuditLogEntry> {
  return createAuditLog({
    adminId: params.adminId,
    adminEmail: params.adminEmail,
    actionType: AuditAction.SYSTEM_CONFIG,
    targetId: params.configKey,
    targetType: 'SystemConfig',
    details: {
      configKey: params.configKey,
      oldValue: params.oldValue,
      newValue: params.newValue,
      changedAt: new Date().toISOString(),
    },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: 'success',
  });
}

/**
 * Query audit logs (with filters)
 */
export interface AuditLogQuery {
  adminId?: string;
  actionType?: AuditAction;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'success' | 'failed';
  limit?: number;
  offset?: number;
}

export async function queryAuditLogs(
  query: AuditLogQuery
): Promise<{ logs: AuditLogEntry[]; total: number }> {
  // TODO: Implement database query
  // This is a mock implementation
  
  const mockLogs: AuditLogEntry[] = [
    {
      id: 'AUDIT-001',
      timestamp: new Date().toISOString(),
      adminId: 'ADMIN-001',
      adminEmail: 'john@securevault-admin.com',
      actionType: AuditAction.APPROVE_VERIFICATION,
      targetId: 'VER-789',
      targetType: 'Verification',
      details: {
        nomineeEmail: 'raj.sharma@example.com',
        userId: 'U-123456',
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120',
      status: 'success',
    },
  ];

  return {
    logs: mockLogs,
    total: mockLogs.length,
  };
}

/**
 * Export audit logs to CSV
 */
export function exportAuditLogsToCSV(logs: AuditLogEntry[]): string {
  const headers = [
    'ID',
    'Timestamp',
    'Admin Email',
    'Action',
    'Target Type',
    'Target ID',
    'Status',
    'IP Address',
    'Details',
  ];

  const rows = logs.map(log => [
    log.id,
    log.timestamp,
    log.adminEmail,
    log.actionType,
    log.targetType,
    log.targetId,
    log.status,
    log.ipAddress,
    JSON.stringify(log.details),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Get audit log statistics
 */
export interface AuditStats {
  totalLogs: number;
  successCount: number;
  failedCount: number;
  actionBreakdown: Record<AuditAction, number>;
  topAdmins: Array<{ adminEmail: string; count: number }>;
}

export async function getAuditStats(
  startDate?: string,
  endDate?: string
): Promise<AuditStats> {
  // TODO: Implement database aggregation
  
  const mockStats: AuditStats = {
    totalLogs: 150,
    successCount: 145,
    failedCount: 5,
    actionBreakdown: {
      [AuditAction.LOGIN]: 50,
      [AuditAction.APPROVE_VERIFICATION]: 30,
      [AuditAction.REJECT_VERIFICATION]: 10,
      [AuditAction.VIEW_DOCUMENT]: 45,
      [AuditAction.LOGOUT]: 10,
      [AuditAction.LOGIN_FAILED]: 5,
      [AuditAction.REQUEST_DOCS]: 0,
      [AuditAction.VIEW_VERIFICATION]: 0,
      [AuditAction.VIEW_USER]: 0,
      [AuditAction.VIEW_USER_ACTIVITY]: 0,
      [AuditAction.SYSTEM_CONFIG]: 0,
      [AuditAction.UPDATE_PLAN_LIMITS]: 0,
      [AuditAction.CREATE_ADMIN]: 0,
      [AuditAction.DELETE_ADMIN]: 0,
      [AuditAction.UPDATE_ADMIN]: 0,
    },
    topAdmins: [
      { adminEmail: 'john@securevault-admin.com', count: 80 },
      { adminEmail: 'sarah@securevault-admin.com', count: 70 },
    ],
  };

  return mockStats;
}

/**
 * Check audit log integrity
 */
export function verifyAuditLogIntegrity(log: AuditLogEntry): boolean {
  // Basic validation
  if (!log.id || !log.timestamp || !log.adminId || !log.actionType) {
    return false;
  }

  // Timestamp validation
  const timestamp = new Date(log.timestamp);
  if (isNaN(timestamp.getTime())) {
    return false;
  }

  // Status validation
  if (log.status !== 'success' && log.status !== 'failed') {
    return false;
  }

  return true;
}

/**
 * Format audit log for display
 */
export function formatAuditLogForDisplay(log: AuditLogEntry): string {
  const date = new Date(log.timestamp).toLocaleString();
  return `[${date}] ${log.adminEmail} performed ${log.actionType} on ${log.targetType} ${log.targetId} - ${log.status}`;
}

/**
 * Get recent admin activity summary
 */
export async function getRecentAdminActivity(
  adminId: string,
  limit: number = 10
): Promise<AuditLogEntry[]> {
  const result = await queryAuditLogs({
    adminId,
    limit,
  });

  return result.logs;
}