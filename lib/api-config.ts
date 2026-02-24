// Update these endpoints based on your Spring Boot server configuration

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    sendOtp: `${API_BASE_URL}/auth/send-otp`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    changePassword: `${API_BASE_URL}/auth/change-password`,
    adminLogin: `${API_BASE_URL}/auth/admin/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    refreshToken: `${API_BASE_URL}/auth/refresh`,
  },

  // User Management
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    updateProfile: `${API_BASE_URL}/users/profile`,
    changePassword: `${API_BASE_URL}/users/password`,
    plans: `${API_BASE_URL}/users/plans`,
    upgradePlan: `${API_BASE_URL}/users/upgrade-plan`,
  },

  // Digital Assets
  assets: {
    list: `${API_BASE_URL}/assets/my`,
    create: `${API_BASE_URL}/assets/upload`,
    get: (id: string) => `${API_BASE_URL}/assets/${id}`,
    update: (id: string) => `${API_BASE_URL}/assets/${id}`,
    delete: (id: string) => `${API_BASE_URL}/assets/${id}`,
  },

  // Nominees
  nominees: {
    list: `${API_BASE_URL}/nominees/my`,
    add: `${API_BASE_URL}/nominees/add`,
    update: (id: string) => `${API_BASE_URL}/nominees/${id}`,
    remove: (id: string) => `${API_BASE_URL}/nominees/${id}`,
    verify: `${API_BASE_URL}/nominees/verify`,
    assignToAsset: (nomineeId: string, assetId: string) => `${API_BASE_URL}/nominees/${nomineeId}/assign/${assetId}`,
    unassignFromAsset: (nomineeId: string, assetId: string) => `${API_BASE_URL}/nominees/${nomineeId}/unassign/${assetId}`,
  },

  // Verification
  verification: {
    verifyToken: (token: string) => `${API_BASE_URL}/verification/verify-token?token=${token}`,
    confirmIdentity: `${API_BASE_URL}/verification/confirm-identity`,
    submitClaim: `${API_BASE_URL}/verification/submit-claim`,
    getStatus: (token: string) => `${API_BASE_URL}/verification/status?token=${token}`,
  },

  // Admin
  admin: {
    login: `${API_BASE_URL}/admin/login`,
    dashboard: `${API_BASE_URL}/admin/verification-requests`, // Alias for compatibility
    verificationRequests: `${API_BASE_URL}/admin/verification-requests`,
    stats: `${API_BASE_URL}/admin/stats`,
    approveRequest: (id: string) => `${API_BASE_URL}/admin/verification-requests/${id}/review`,
    rejectRequest: (id: string) => `${API_BASE_URL}/admin/verification-requests/${id}/review`,
    users: `${API_BASE_URL}/admin/users`,
    logs: `${API_BASE_URL}/admin/logs`,
  },

  // Payments
  payments: {
    createOrder: `${API_BASE_URL}/payments/create-order`,
    verifyPayment: `${API_BASE_URL}/payments/verify`,
  },
}

// Helper function to get auth token from localStorage
// Prioritizes adminToken when on admin pages to ensure ROLE_ADMIN is available
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    const isAdminPage = window.location.pathname.startsWith("/admin")
    if (isAdminPage) {
      return localStorage.getItem("adminToken") || localStorage.getItem("authToken")
    }
    return localStorage.getItem("authToken") || localStorage.getItem("adminToken")
  }
  return null
}

// Helper function to set auth token
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

// Helper function to clear auth token
export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}
