import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Spinner from "../components/ui/Spinner"

export default function ProtectedRoute() {
  const { isAuth, isInitialized } = useAuth()

  if (!isInitialized) return <Spinner fullscreen />
  if (!isAuth)        return <Navigate to="/login" replace />

  return <Outlet />
}