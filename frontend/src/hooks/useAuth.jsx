import { useSelector, useDispatch } from 'react-redux'
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
} from '../features/auth/authThunks'
import { clearErrors } from '../features/auth/authSlice'

export default function useAuth() {
  const dispatch = useDispatch()

  return {

    user:            useSelector(selectUser),
    isAuth:          useSelector(selectIsAuth),
    isLoading:       useSelector(selectIsLoading),
    isInitialized:   useSelector(selectIsInitialized),
    errors:          useSelector(selectErrors),
    globalError:     useSelector(selectGlobalError),
    role:            useSelector(selectRole),

    // ── ACTIONS ───────────────────────
    login:       (data) => dispatch(loginThunk(data)),
    register:    (data) => dispatch(registerThunk(data)),
    logout:      ()     => dispatch(logoutThunk()),
    fetchMe:     ()     => dispatch(fetchMeThunk()),
    clearErrors: ()     => dispatch(clearErrors()),
  }
}