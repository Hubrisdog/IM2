import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  needsPasswordReset?: boolean
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = typeof window !== 'undefined' && window.atob
      ? window.atob(base64)
      : Buffer.from(base64, 'base64').toString('binary')
    const jsonPayload = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  let initToken = ''
  if (cookieState) {
    try {
      initToken = JSON.parse(cookieState)
    } catch {
      initToken = cookieState
    }
  }

  const decoded = initToken ? parseJwt(initToken) : null
  const initUser = decoded ? {
    accountNo: String(decoded.id),
    email: decoded.email,
    role: Array.isArray(decoded.role) ? decoded.role : [decoded.role],
    exp: decoded.exp * 1000
  } : null

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          // Automatically decode the token and update the user state as well
          const newDecoded = parseJwt(accessToken)
          const newUser = newDecoded ? {
            accountNo: String(newDecoded.id),
            email: newDecoded.email,
            role: Array.isArray(newDecoded.role) ? newDecoded.role : [newDecoded.role],
            exp: newDecoded.exp * 1000
          } : null
          return { ...state, auth: { ...state.auth, accessToken, user: newUser } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
