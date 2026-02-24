import { getAuthToken } from "./api-config"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Make an authenticated API request to the Spring Boot backend
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAuthToken()

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  }

  // Only set application/json if not FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      console.error(`❌ [API Client] 401 Unauthorized for ${endpoint}`);
      // Token expired, clear and redirect to appropriate login
      const isAdminPage = typeof window !== "undefined" && window.location.pathname.startsWith("/admin")
      if (isAdminPage) {
        console.log("🔄 [API Client] Redirecting to /admin/login");
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminEmail")
        window.location.href = "/admin/login"
      } else {
        console.log("🔄 [API Client] Redirecting to /login");
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
      return { success: false, error: "Unauthorized" }
    }

    const text = await response.text();
    let data: any = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Failed to parse response as JSON:", text);
        data = { message: text };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || "An error occurred",
      }
    }

    return {
      success: true,
      data,
      message: data.message,
    }
  } catch (error) {
    console.error("API request error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

/**
 * Make a GET request
 */
export function apiGet<T>(endpoint: string, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, { ...options, method: "GET" })
}

/**
 * Make a POST request
 */
export function apiPost<T>(endpoint: string, body?: any, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  })
}

/**
 * Make a PUT request
 */
export function apiPut<T>(endpoint: string, body?: any, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  })
}

/**
 * Make a DELETE request
 */
export function apiDelete<T>(endpoint: string, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" })
}
