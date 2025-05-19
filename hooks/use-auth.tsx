"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Load user and token from cookies
    const loadAuth = () => {
      const cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=")
          acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )

      if (cookies.token) {
        setToken(cookies.token)
      }

      if (cookies.user) {
        try {
          setUser(JSON.parse(decodeURIComponent(cookies.user)))
        } catch (e) {
          console.error("Failed to parse user from cookie", e)
        }
      }
    }

    loadAuth()
  }, [])

  const logout = () => {
    // Clear cookies
    document.cookie = "token=; path=/; max-age=0"
    document.cookie = "user=; path=/; max-age=0"

    // Clear state
    setUser(null)
    setToken(null)
  }

  return <AuthContext.Provider value={{ user, token, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
