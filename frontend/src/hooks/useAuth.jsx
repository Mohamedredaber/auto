import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectUser,
  selectIsAuth,
  selectIsLoading,
  selectIsInitialized,
  selectErrors,
  selectGlobalError,
  selectRole,
} from '../features/auth/authSelectors'
import {
  loginThunk,
  logoutThunk,
  registerThunk,
  fetchMeThunk,
  registerAgencyThunk,
} from '../features/auth/authThunks'
import { clearErrors } from '../features/auth/authSlice'
import { ROLES }       from '../constants/roles'


export default function useAuth() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()

  /* ── State ─────────────────────────────────── */
  const user            = useSelector(selectUser)
  const isAuth          = useSelector(selectIsAuth)
  const isLoading       = useSelector(selectIsLoading)
  const isInitialized   = useSelector(selectIsInitialized)
  const errors          = useSelector(selectErrors)
  const globalError     = useSelector(selectGlobalError)
  const role            = useSelector(selectRole)

  const redirectByRole = (resolvedRole) => {
    switch (resolvedRole) {
      case ROLES.SUPER_ADMIN:  navigate('/dashboard/admin',   { replace: true }); break
      case ROLES.ADMIN_AGENCY: navigate('/dashboard/agency',  { replace: true }); break
      case ROLES.CLIENT:
      default:                 navigate('/dashboard/client',  { replace: true }); break
    }
  }

  /* ── Actions ─────────────────────────────────── */

  /**
   * login(credentials) → retourne { success, role } pour la redirection côté composant
   */
  const login = async (credentials) => {
    const result = await dispatch(loginThunk(credentials))
    if (loginThunk.fulfilled.match(result)) {
      return { success: true, role: result.payload.role }
    }
    return { success: false }
  }

  /**
   * register(data) → retourne { success }
   */
  const register = async (data) => {
    const result = await dispatch(registerThunk(data))
    return { success: registerThunk.fulfilled.match(result) }
  }

  /**
   * logout() → déconnecte et redirige
   */
  const logout = async () => {
    await dispatch(logoutThunk())
    navigate('/login', { replace: true })
  }

  /**
   * fetchMe() → appelé au boot de l'app (App.jsx)
   */
  const fetchMe = () => dispatch(fetchMeThunk())

  /**
   * registerAgency(formData) → retourne { success }
   */
  const registerAgency = async (formData) => {
    const result = await dispatch(registerAgencyThunk(formData))
    return { success: registerAgencyThunk.fulfilled.match(result) }
  }

  return {
    /* State */
    user,
    isAuth,
    isLoading,
    isInitialized,
    errors,
    globalError,
    role,


    /* Actions */
    login,
    register,
    logout,
    fetchMe,
    registerAgency,
    redirectByRole,
    clearErrors: () => dispatch(clearErrors()),
  }
}