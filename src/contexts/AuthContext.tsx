import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  login as icLogin,
  register as icRegister,
  logout as icLogout,
  getCurrentUser,
  resetPassword as icResetPassword,
  ICUser,
} from '@/lib/auth'

// ─────────────────────────────────────────────────────────────
// Types — compatible with existing codebase consumer patterns
// ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  name?: string
  role?: string
  // Legacy Supabase compat fields
  user_metadata?: { display_name?: string; avatar_url?: string }
}

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Map ICUser JWT payload → AuthUser shape used across the app
function mapUser(ic: ICUser): AuthUser {
  return {
    id: ic.sub,
    email: ic.email,
    name: ic.name,
    role: ic.role,
    user_metadata: {
      display_name: ic.name,
    },
  }
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore session from localStorage if valid JWT exists
  useEffect(() => {
    const ic = getCurrentUser()
    setUser(ic ? mapUser(ic) : null)
    setLoading(false)
  }, [])

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ error: Error | null }> => {
    try {
      const ic = await icLogin(email, password)
      setUser(mapUser(ic))
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Login failed') }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<{ error: Error | null }> => {
    try {
      const ic = await icRegister(email, password, displayName)
      setUser(mapUser(ic))
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Registration failed') }
    }
  }

  const signOut = async (): Promise<void> => {
    icLogout()
    setUser(null)
  }

  // Google OAuth not supported in Identity Core v1 — graceful error
  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    return {
      error: new Error('Google OAuth inte tillgängligt. Använd e-post och lösenord.'),
    }
  }

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      await icResetPassword(email)
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Reset failed') }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
