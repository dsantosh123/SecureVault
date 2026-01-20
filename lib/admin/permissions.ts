// lib/admin/permissions.ts
// Role-Based Access Control (RBAC) for Admin Panel

export type AdminRole = 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

export enum Permission {
  // Verification Management
  VIEW_VERIFICATIONS = 'view_verifications',
  APPROVE_VERIFICATION = 'approve_verification',
  REJECT_VERIFICATION = 'reject_verification',
  REQUEST_DOCUMENTS = 'request_documents',
  
  // Document Access
  VIEW_DOCUMENTS = 'view_documents',
  
  // User Management
  VIEW_USERS = 'view_users',
  VIEW_USER_ACTIVITY = 'view_user_activity',
  
  // Audit Logs
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  EXPORT_AUDIT_LOGS = 'export_audit_logs',
  
  // System Configuration
  VIEW_SYSTEM_SETTINGS = 'view_system_settings',
  EDIT_SYSTEM_SETTINGS = 'edit_system_settings',
  MANAGE_PLAN_LIMITS = 'manage_plan_limits',
  
  // Admin Management (Super Admin only)
  CREATE_ADMIN = 'create_admin',
  DELETE_ADMIN = 'delete_admin',
  MANAGE_ADMINS = 'manage_admins',
}

// Role-Permission Mapping
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  ROLE_ADMIN: [
    // Verification
    Permission.VIEW_VERIFICATIONS,
    Permission.APPROVE_VERIFICATION,
    Permission.REJECT_VERIFICATION,
    Permission.REQUEST_DOCUMENTS,
    
    // Documents
    Permission.VIEW_DOCUMENTS,
    
    // Users
    Permission.VIEW_USERS,
    Permission.VIEW_USER_ACTIVITY,
    
    // Audit
    Permission.VIEW_AUDIT_LOGS,
    Permission.EXPORT_AUDIT_LOGS,
    
    // System (view only)
    Permission.VIEW_SYSTEM_SETTINGS,
  ],
  
  ROLE_SUPER_ADMIN: [
    // All ROLE_ADMIN permissions
    ...Object.values(Permission),
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if role is Super Admin
 */
export function isSuperAdmin(role: AdminRole): boolean {
  return role === 'ROLE_SUPER_ADMIN';
}

/**
 * Validate if admin can perform action
 */
export function canPerformAction(
  role: AdminRole,
  action: Permission
): { allowed: boolean; reason?: string } {
  if (!hasPermission(role, action)) {
    return {
      allowed: false,
      reason: `Role ${role} does not have permission: ${action}`,
    };
  }

  return { allowed: true };
}

/**
 * Page access control
 */
export enum AdminPage {
  DASHBOARD = '/admin/dashboard',
  VERIFICATION = '/admin/verification',
  USERS = '/admin/users',
  DOCUMENTS = '/admin/documents',
  LOGS = '/admin/logs',
  SETTINGS = '/admin/settings',
}

const PAGE_REQUIRED_PERMISSIONS: Record<AdminPage, Permission[]> = {
  [AdminPage.DASHBOARD]: [Permission.VIEW_VERIFICATIONS],
  [AdminPage.VERIFICATION]: [Permission.VIEW_VERIFICATIONS],
  [AdminPage.USERS]: [Permission.VIEW_USERS],
  [AdminPage.DOCUMENTS]: [Permission.VIEW_DOCUMENTS],
  [AdminPage.LOGS]: [Permission.VIEW_AUDIT_LOGS],
  [AdminPage.SETTINGS]: [Permission.VIEW_SYSTEM_SETTINGS],
};

/**
 * Check if admin can access a page
 */
export function canAccessPage(
  role: AdminRole,
  page: AdminPage
): { allowed: boolean; reason?: string } {
  const requiredPermissions = PAGE_REQUIRED_PERMISSIONS[page];
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return { allowed: true };
  }

  const hasAccess = hasAllPermissions(role, requiredPermissions);

  if (!hasAccess) {
    return {
      allowed: false,
      reason: `Missing required permissions for page: ${page}`,
    };
  }

  return { allowed: true };
}

/**
 * Get accessible pages for a role
 */
export function getAccessiblePages(role: AdminRole): AdminPage[] {
  return Object.values(AdminPage).filter(page => {
    const result = canAccessPage(role, page);
    return result.allowed;
  });
}

/**
 * Action permissions checker
 */
export interface ActionCheck {
  action: string;
  permission: Permission;
  requiresSuperAdmin?: boolean;
}

const ACTION_PERMISSIONS: Record<string, ActionCheck> = {
  approveVerification: {
    action: 'Approve Verification',
    permission: Permission.APPROVE_VERIFICATION,
  },
  rejectVerification: {
    action: 'Reject Verification',
    permission: Permission.REJECT_VERIFICATION,
  },
  viewDocument: {
    action: 'View Document',
    permission: Permission.VIEW_DOCUMENTS,
  },
  editSystemSettings: {
    action: 'Edit System Settings',
    permission: Permission.EDIT_SYSTEM_SETTINGS,
    requiresSuperAdmin: true,
  },
  createAdmin: {
    action: 'Create Admin',
    permission: Permission.CREATE_ADMIN,
    requiresSuperAdmin: true,
  },
};

/**
 * Check if admin can perform a named action
 */
export function canPerformNamedAction(
  role: AdminRole,
  actionName: keyof typeof ACTION_PERMISSIONS
): { allowed: boolean; reason?: string } {
  const actionCheck = ACTION_PERMISSIONS[actionName];

  if (!actionCheck) {
    return {
      allowed: false,
      reason: `Unknown action: ${actionName}`,
    };
  }

  if (actionCheck.requiresSuperAdmin && !isSuperAdmin(role)) {
    return {
      allowed: false,
      reason: `${actionCheck.action} requires Super Admin role`,
    };
  }

  return canPerformAction(role, actionCheck.permission);
}

/**
 * Middleware helper: Require permission
 */
export function requirePermission(permission: Permission) {
  return (role: AdminRole) => {
    const result = canPerformAction(role, permission);
    if (!result.allowed) {
      throw new Error(result.reason || 'Permission denied');
    }
  };
}

/**
 * Middleware helper: Require Super Admin
 */
export function requireSuperAdmin(role: AdminRole): void {
  if (!isSuperAdmin(role)) {
    throw new Error('This action requires Super Admin privileges');
  }
}

/**
 * Get permission description
 */
export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    [Permission.VIEW_VERIFICATIONS]: 'View nominee verification requests',
    [Permission.APPROVE_VERIFICATION]: 'Approve verification requests',
    [Permission.REJECT_VERIFICATION]: 'Reject verification requests',
    [Permission.REQUEST_DOCUMENTS]: 'Request document re-upload from nominees',
    [Permission.VIEW_DOCUMENTS]: 'View uploaded death certificates',
    [Permission.VIEW_USERS]: 'View user list and metadata',
    [Permission.VIEW_USER_ACTIVITY]: 'View user activity timeline',
    [Permission.VIEW_AUDIT_LOGS]: 'View system audit logs',
    [Permission.EXPORT_AUDIT_LOGS]: 'Export audit logs to CSV',
    [Permission.VIEW_SYSTEM_SETTINGS]: 'View system configuration',
    [Permission.EDIT_SYSTEM_SETTINGS]: 'Modify system settings',
    [Permission.MANAGE_PLAN_LIMITS]: 'Change plan limits and pricing',
    [Permission.CREATE_ADMIN]: 'Create new admin accounts',
    [Permission.DELETE_ADMIN]: 'Delete admin accounts',
    [Permission.MANAGE_ADMINS]: 'Manage admin users',
  };

  return descriptions[permission] || 'Unknown permission';
}

/**
 * Export role information for UI display
 */
export function getRoleInfo(role: AdminRole): {
  name: string;
  description: string;
  permissions: Permission[];
} {
  const roleInfo = {
    ROLE_ADMIN: {
      name: 'Admin',
      description: 'Can review verifications and view user activity',
    },
    ROLE_SUPER_ADMIN: {
      name: 'Super Admin',
      description: 'Full system access including configuration',
    },
  };

  return {
    ...roleInfo[role],
    permissions: getRolePermissions(role),
  };
}