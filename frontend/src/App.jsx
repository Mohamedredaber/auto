import { useEffect }  from "react"
import { useDispatch } from "react-redux"
import { fetchMeThunk } from "./features/auth/authThunks"
import AppRoutes        from "./route/AppRoutes"

/**
 * App — Point d'entrée principal
 *
 * Au montage, on appelle fetchMe() pour vérifier si l'utilisateur
 * a une session active côté serveur (Sanctum cookie).
 * Cela permet de restaurer l'état auth après un rechargement de page.
 */
function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Bootstrap : vérifie la session Sanctum au démarrage
    // Si authentifié → isAuth = true, user et role remplis
    // Si non authentifié → isInitialized = true, isAuth = false
    dispatch(fetchMeThunk())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <AppRoutes />
}

export default App