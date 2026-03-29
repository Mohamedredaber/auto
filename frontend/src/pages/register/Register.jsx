import { useState }           from "react"
import { useDispatch }         from "react-redux"
import { clearErrors }         from "../../features/auth/authSlice"
import { ViewType, ViewClient, ViewSuccess } from "./components"
import RegisterAgency          from "./components/RegisterAgency"

/* ══════════════════════════════════════════════════════════════
   Register — composant parent
   Views :
     "type"    — choix du type de compte
     "client"  — formulaire client (1 étape)
     "agence"  — formulaire agence (2 steps en 1 composant)
     "success" — écran de confirmation (si besoin)
══════════════════════════════════════════════════════════════ */
export default function Register() {

  const dispatch = useDispatch()
  const [view, setView] = useState("type")
  const goTo = (nextView) => {
    dispatch(clearErrors())
    setView(nextView)
  }

  return (
    <div className="rp-root">
      <div className="rp-page">
        <div className="rp-right">
          <div className="rp-form-wrap">

            {view === "type" && (
              <ViewType
                onSelect={(t) => goTo(t === "client" ? "client" : "agence")}
              />
            )}

            {view === "client" && (
              <ViewClient
                onBack={() => goTo("type")}
                onSuccess={() => goTo("success")}
              />
            )}

            {view === "agence" && (
              <RegisterAgency
                onBack={() => goTo("type")}
                // Redirect vers /dashboard géré en interne via useNavigate
              />
            )}

            {view === "success" && (
              <ViewSuccess type="client" />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
