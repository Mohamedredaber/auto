import { useState } from "react";
import { ViewType, ViewClient, StepAgencyInfo, ViewAgence2, ViewSuccess } from "./components";

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Register() {
  // views: 'type' | 'client' | 'agence1' | 'agence2' | 'success'
  const [view, setView] = useState("type");
  const [successType, setSuccessType] = useState(null);
  const handleSuccess = type => {
    setSuccessType(type);
    setView("success");
  };

  const stepsVisible = view === "agence1" || view === "agence2";

  return (
    <div className="rp-root">
      <div className="rp-page">


        {/* RIGHT */}
        <div className="rp-right">
          <div className="rp-form-wrap">
            {/* STEP INDICATOR */}
            <div className={`rp-steps${stepsVisible ? " visible" : ""}`}>
              <div className={`rp-step-dot${view === "agence1" ? " active" : view === "agence2" ? " done" : ""}`} />
              <div className={`rp-step-dot${view === "agence2" ? " active" : ""}`} />
              <span className="rp-step-lbl">
                Étape <b>{view === "agence2" ? 2 : 1}</b> sur 2
              </span>
            </div>

            {view === "type" && <ViewType onSelect={t => setView(t === "client" ? "client" : "agence1")} />}
            {view === "client" && <ViewClient onBack={() => setView("type")} onSuccess={handleSuccess} />}
            {view === "agence1" && <StepAgencyInfo onBack={() => setView("type")} onNext={() => setView("agence2")} />}
            {view === "agence2" && <ViewAgence2 onBack={() => setView("agence1")} onSuccess={handleSuccess} />}
            {view === "success" && <ViewSuccess type={successType} />}
          </div>
        </div>
      </div>
    </div>
  );
}