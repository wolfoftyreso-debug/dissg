// Identity Core JWT Auth — api.wavult.com
// Replaces Supabase auth entirely

const IC_BASE = 'https://api.wavult.com'
const TOKEN_KEY = 'dissg_token'

export interface ICUser {
  sub: string
  email: string
  name?: string
  role?: string
  exp: number
  iat: number
}

// Login — returns user payload from JWT
export async function login(email: string, password: string): Promise<ICUser> {
  const res = await fetch(`${IC_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Login failed')
    throw new Error(msg || 'Login failed')
  }
  const { access_token } = await res.json()
  localStorage.setItem(TOKEN_KEY, access_token)
  return decodeJWT(access_token)!
}

// Register — creates account and logs in
export async function register(
  email: string,
  password: string,
  displayName?: string,
): Promise<ICUser> {
  const res = await fetch(`${IC_BASE}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: displayName }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Registration failed')
    throw new Error(msg || 'Registration failed')
  }
  const { access_token } = await res.json()
  localStorage.setItem(TOKEN_KEY, access_token)
  return decodeJWT(access_token)!
}

// Decode JWT payload — no verification (client-side, for display only)
function decodeJWT(token: string): ICUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload as ICUser
  } catch {
    return null
  }
}

// Get current user — returns null if no token or expired
export function getCurrentUser(): ICUser | null {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  try {
    const payload = decodeJWT(token)
    if (!payload) return null
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    return payload
  } catch {
    return null
  }
}

// Get raw token (for API calls)
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  const user = getCurrentUser()
  return user ? token : null
}

// Logout
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// Refresh token if close to expiry (< 5 minutes left)
export async function refreshIfNeeded(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return
  const payload = decodeJWT(token)
  if (!payload) return
  const timeLeft = payload.exp - Date.now() / 1000
  if (timeLeft > 300) return // More than 5 minutes left — no refresh needed
  try {
    const res = await fetch(`${IC_BASE}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const { access_token } = await res.json()
      localStorage.setItem(TOKEN_KEY, access_token)
    }
  } catch {
    // Silent fail — user stays logged in until expiry
  }
}

// Reset password request
export async function resetPassword(email: string): Promise<void> {
  const res = await fetch(`${IC_BASE}/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Reset password request failed')
}
