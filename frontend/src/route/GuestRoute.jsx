import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLE_HOME } from "../constants/roles"

export default function GuestRoute() {
  const { isAuth, role, needsCompletion } = useAuth()

  if (isAuth) {
    if (needsCompletion) return <Navigate to="/complete-profile" replace />
    return <Navigate to={ROLE_HOME[role] || "/"} replace />
  }
  return <Outlet />
}