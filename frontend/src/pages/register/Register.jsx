import { useState }    from "react"
import { useDispatch } from "react-redux"
import { clearErrors } from "../../features/auth/authSlice"
import {
  ViewType,
  ViewClient,
  StepAgencyInfo,
  ViewAgence2,
  ViewSuccess,
} from "./components"

/* ══════════════════════════════════════════════════════════════════
   Register — composant parent
   Orchestre les vues : type → client | (agence1 → agence2) → success

   Views :
     "type"    — choix du type de compte
     "client"  — formulaire client (1 étape)
     "agence1" — step 1 agence : infos personnelles
     "agence2" — step 2 agence : infos agence + logo
     "success" — écran de confirmation
══════════════════════════════════════════════════════════════════ */
export default function Register() {

  const dispatch = useDispatch()

  const [view, setView]               = useState("type")
  const [successType, setSuccessType] = useState(null)

  /** Navigue vers une vue et efface les erreurs du store */
  const goTo = (nextView) => {
    dispatch(clearErrors())
    setView(nextView)
  }

  const handleSuccess = (type) => {
    setSuccessType(type)
    setView("success")
  }

  const stepsVisible = view === "agence1" || view === "agence2"

  return (
    <div className="rp-root">
      <div className="rp-page">

        {/* RIGHT */}
        <div className="rp-right">
          <div className="rp-form-wrap">

            {/* STEP INDICATOR — visible uniquement pour le flux agence */}
            <div className={`rp-steps${stepsVisible ? " visible" : ""}`}>
              <div className={`rp-step-dot${
                view === "agence1" ? " active" : view === "agence2" ? " done" : ""
              }`} />
              <div className={`rp-step-dot${view === "agence2" ? " active" : ""}`} />
              <span className="rp-step-lbl">
                Étape <b>{view === "agence2" ? 2 : 1}</b> sur 2
              </span>
            </div>

            {view === "type" && (
              <ViewType
                onSelect={(t) => goTo(t === "client" ? "client" : "agence1")}
              />
            )}

            {view === "client" && (
              <ViewClient
                onBack={() => goTo("type")}
                onSuccess={handleSuccess}
              />
            )}

            {view === "agence1" && (
              <StepAgencyInfo
                onBack={() => goTo("type")}
                onNext={() => goTo("agence2")}  // ✅ pas besoin de passer values ici
              />                                 //    elles sont dans Redux (agencyDraft)
            )}

            {view === "agence2" && (
              <ViewAgence2
                onBack={() => goTo("agence1")}
                onSuccess={handleSuccess}
                // ✅ agencyDraft n'est plus passé en prop — ViewAgence2 lit depuis Redux
              />
            )}

            {view === "success" && (
              <ViewSuccess type={successType} />
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
