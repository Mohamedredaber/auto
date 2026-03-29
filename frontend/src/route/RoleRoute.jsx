import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLE_HOME } from "../constants/roles"

export default function RoleRoute({ allowedRoles }) {
  const { role } = useAuth()


  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || "/login"} replace />
  }

  return <Outlet />
}