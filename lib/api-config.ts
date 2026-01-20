// Update these endpoints based on your Spring Boot server configuration

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
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
    list: `${API_BASE_URL}/assets`,
    create: `${API_BASE_URL}/assets`,
    get: (id: string) => `${API_BASE_URL}/assets/${id}`,
    update: (id: string) => `${API_BASE_URL}/assets/${id}`,
    delete: (id: string) => `${API_BASE_URL}/assets/${id}`,
  },

  // Nominees
  nominees: {
    list: `${API_BASE_URL}/nominees`,
    add: `${API_BASE_URL}/nominees`,
    update: (id: string) => `${API_BASE_URL}/nominees/${id}`,
    remove: (id: string) => `${API_BASE_URL}/nominees/${id}`,
    verify: `${API_BASE_URL}/nominees/verify`,
  },

  // Admin
  admin: {
    login: `${API_BASE_URL}/admin/login`,
    dashboard: `${API_BASE_URL}/admin/verification-requests`,
    approveRequest: (id: string) => `${API_BASE_URL}/admin/verification-requests/${id}/approve`,
    rejectRequest: (id: string) => `${API_BASE_URL}/admin/verification-requests/${id}/reject`,
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
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
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
