import { Link, useNavigate }       from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginThunk }               from "../../features/auth/authThunks"
import { selectErrors, selectGlobalError } from "../../features/auth/authSelectors"
import { clearErrors }              from "../../features/auth/authSlice"
import { useForm }                  from "../../hooks/useForm"
import {
  InputField,
  PasswordInputInternal,
} from "../register/components/FormComponents"
import * as Icon                    from "../../components/layout/icons"
import { ROLES }                    from "../../constants/roles"
import "../../styles/pages/register.css"   /* tokens communs rp-* */
import "../../styles/pages/login.css"

/* ══════════════════════════════════════
   Icônes SVG inline pour le panel gauche
══════════════════════════════════════ */
const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
)
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

/* ══════════════════════════════════════
   Panneau gauche décoratif
══════════════════════════════════════ */
function LeftPanel() {
  return (
    <div className="lp-left">
      <div className="lp-brand">
        <div className="lp-brand-logo">
          <div className="lp-brand-dot" />
          AutoConnect
        </div>
      </div>

      {/* Cartes stats flottantes */}
      <div className="lp-stats">
        <div className="lp-stat-card">
          <div className="lp-stat-icon"><CarIcon /></div>
          <div>
            <div className="lp-stat-val">2 400+</div>
            <div className="lp-stat-lbl">Véhicules disponibles</div>
          </div>
        </div>
        <div className="lp-stat-card">
          <div className="lp-stat-icon"><UsersIcon /></div>
          <div>
            <div className="lp-stat-val">18 000</div>
            <div className="lp-stat-lbl">Clients satisfaits</div>
          </div>
        </div>
        <div className="lp-stat-card">
          <div className="lp-stat-icon" style={{ color: "#fbbf24" }}><StarIcon /></div>
          <div>
            <div className="lp-stat-val">4.9 / 5</div>
            <div className="lp-stat-lbl">Note moyenne</div>
          </div>
        </div>
      </div>

      {/* Citation */}
      <div className="lp-quote">
        <div className="lp-quote-marks">"</div>
        <p className="lp-quote-text">
          La meilleure plateforme pour gérer ma flotte et trouver des clients en
          quelques clics. Vraiment impressionnant.
        </p>
        <div className="lp-quote-author">
          <div className="lp-quote-avatar">KA</div>
          <div>
            <div className="lp-quote-info-name">Karim Alaoui</div>
            <div className="lp-quote-info-role">Gérant · AutoLux Marrakech</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   Page Login principale
══════════════════════════════════════ */
export default function Login() {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const apiErrors   = useSelector(selectErrors)
  const globalError = useSelector(selectGlobalError)

  /* ── Validation locale ───────────────────────── */
  const validate = (values) => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Email invalide"
    if (!values.password)
      e.password = "Mot de passe requis"
    return e
  }

  /* ── Submit ──────────────────────────────────── */
  const onSubmit = async (values) => {
    dispatch(clearErrors())
    const result = await dispatch(
      loginThunk({ email: values.email, password: values.password })
    )

    if (loginThunk.fulfilled.match(result)) {
      const role = result.payload.role

      switch (role) {
        case ROLES.SUPER_ADMIN:  navigate("/dashboard/admin",  { replace: true }); break
        case ROLES.ADMIN_AGENCY: navigate("/dashboard/agency", { replace: true }); break
        default:                 navigate("/dashboard/client", { replace: true }); break
      }
    }
  }

  const {
    values, errors, isSubmitting,
    handleChange, handleSubmit,
  } = useForm({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit,
  })

  return (
    <div className="lp-root">
      <div className="lp-page">

        <LeftPanel />

        <div className="lp-right">
          <div className="lp-form-wrap lp-view">

            <div className="lp-fheader">
              <h1 className="lp-ftitle">
                Bon retour{" "}
                <span className="lp-ftitle-accent">parmi nous</span>
              </h1>
              <p className="lp-fsub">
                Connectez-vous pour accéder à votre espace et gérer vos réservations.
              </p>
            </div>

            {globalError && (
              <div className="lp-global-error">
                <Icon.Error /> {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <InputField
                label="Adresse email"
                id="lEmail"
                name="email"
                type="email"
                placeholder="contact@exemple.ma"
                icon={<Icon.Mail />}
                value={values.email}
                onChange={handleChange}
                error={errors.email || apiErrors?.email?.[0]}
              />

              <div className="rp-group">
                <label className="rp-label" htmlFor="lPass">Mot de passe</label>
                <div className="rp-input-wrap">
                  <span className="rp-icon"><Icon.Lock /></span>
                  <PasswordInputInternal
                    id="lPass"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>
                {(errors.password || apiErrors?.password?.[0]) && (
                  <span className="rp-errmsg show">
                    <Icon.Error />
                    {errors.password || apiErrors?.password?.[0]}
                  </span>
                )}
              </div>

              <div className="lp-remember">
                <label className="lp-checkbox-wrap">
                  <input
                    id="lRemember"
                    type="checkbox"
                    name="remember"
                    className="lp-checkbox"
                  />
                  <span className="lp-checkbox-lbl">Se souvenir de moi</span>
                </label>
                <a href="#" className="lp-forgot">Mot de passe oublié ?</a>
              </div>

              {/* Actions */}
              <div className="lp-btn-actions">
                <button
                  id="lSubmitBtn"
                  type="submit"
                  className="lp-btn lp-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><div className="lp-spin" /> Connexion en cours…</>
                  ) : (
                    <><Icon.Login /> Se connecter</>
                  )}
                </button>

                <div className="lp-or"><span>ou continuer avec</span></div>

                <button type="button" className="lp-btn lp-btn-google">
                  <Icon.Google /> Connexion avec Google
                </button>
              </div>

            </form>

            {/* Footer */}
            <div className="lp-register-link">
              Pas encore de compte ?{" "}
              <Link to="/register">Créer un compte</Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}