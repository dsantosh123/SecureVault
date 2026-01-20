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

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  // if (token) {
  //   headers["Authorization"] = `Bearer ${token}`
  // }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired, clear and redirect to login
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/login"
      return { success: false, error: "Unauthorized" }
    }

    const data = await response.json()

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
export function apiPost<T>(endpoint: string, body?: unknown, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Make a PUT request
 */
export function apiPut<T>(endpoint: string, body?: unknown, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Make a DELETE request
 */
export function apiDelete<T>(endpoint: string, options: RequestInit = {}) {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" })
}
