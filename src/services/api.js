import axios from 'axios'

// =======================================================
// AXIOS INSTANCE - Production-ready configuration
// =======================================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection hint
  },
})

// =======================================================
// REQUEST INTERCEPTOR - Security & Auth Headers
// =======================================================
api.interceptors.request.use(
  (config) => {
    // Inject Bearer token if present
    const token = localStorage.getItem('astro_auth_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date().getTime() }

    // Sanitize query params - prevent potential injection
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (typeof config.params[key] === 'string') {
          config.params[key] = config.params[key].trim().substring(0, 500)
        }
      })
    }

    return config
  },
  (error) => {
    console.error('[Axios Request Error]', error)
    return Promise.reject(error)
  }
)

// =======================================================
// RESPONSE INTERCEPTOR - Error Handling
// =======================================================
api.interceptors.response.use(
  (response) => {
    // Compute response time for monitoring
    const endTime = new Date().getTime()
    const duration = endTime - response.config.metadata?.startTime
    if (import.meta.env.DEV) {
      console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status} (${duration}ms)`)
    }
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // Handle specific HTTP errors
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('astro_auth_token')
          // Import router lazily to avoid circular deps
          import('../router/index.js').then(({ default: router }) => {
            router.push('/login').catch(() => {})
          })
          break

        case 403:
          console.warn('[API] Forbidden - Insufficient permissions')
          break

        case 404:
          console.warn('[API] Resource not found:', error.config?.url)
          break

        case 422:
          // Validation errors - pass through to caller
          console.warn('[API] Validation error:', data)
          break

        case 429:
          console.warn('[API] Rate limit exceeded. Please slow down.')
          break

        case 500:
        case 503:
          console.error('[API] Server error:', data)
          break

        default:
          console.error('[API] Unhandled error:', status, data)
      }
    } else if (error.request) {
      // Network error (no response received)
      console.error('[API] Network error - no response received')
    } else {
      console.error('[API] Error setting up request:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
