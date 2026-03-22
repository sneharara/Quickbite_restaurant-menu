import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith("/admin") ? "/admin/login" : "/kitchen/login"
    return <Navigate to={loginPath} replace />
  }
  return children
}
