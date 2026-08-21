import { createContext, useState, useContext, useEffect } from "react"
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError(err.message || 'Error inesperado');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    initAuth();
  }, []);
  
  

  const login = async (email, password) => {
    // setLoading(true)
    setError(null)
    try {
      const user = await loginUser(email, password)
      setCurrentUser(user)
      return user
    } catch (err) {
      setError(err.message || "Failed to login")
      throw err
    } finally {
      // setLoading(false)
    }
  }

  const register = async (userData) => {
    // setLoading(true)
    setError(null)
    try {
      const user = await registerUser(userData)
      setCurrentUser(user)
      return user
    } catch (err) {

      console.error("Error registering user:", err.response.data?.error)
      setError(err.response.data?.error || "Failed to register")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await logoutUser()
      setCurrentUser(null)
    } catch (err) {
      setError(err.message || "Failed to logout")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
