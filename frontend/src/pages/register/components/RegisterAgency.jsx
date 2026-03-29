import { useState, useCallback }      from "react"
import { useDispatch, useSelector }    from "react-redux"
import { useNavigate }                 from "react-router-dom"
import * as Icon                       from "../../../components/layout/icons"
import {
  InputField,
  PasswordInputInternal,
  PasswordStrength,
  SelectField,
  UploadLogo,
}                                      from "./FormComponents"
import { Link }                        from "react-router-dom"
import { registerAgencyThunk }         from "../../../features/auth/authThunks"
import {
  selectErrors,
  selectGlobalError,
  selectIsLoading,
}                                      from "../../../features/auth/authSelectors"
import { clearErrors }                 from "../../../features/auth/authSlice"
import socialaccountlabel              from "../../../data/socialaccountlabel"

/* ─── Constantes ──────────────────────────────────────────── */
const VILLES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger",
  "Agadir","Meknès","Oujda","Tétouan","Essaouira",
  "El Jadida","Dakhla","Laâyoune","Béni Mellal",
]

const INITIAL = {
  /* Step 1 — infos personnelles */
  first_name:            "",
  last_name:             "",
  email:                 "",
  phone:                 "",
  password:              "",
  password_confirmation: "",
  /* Step 2 — infos agence */
  agency_name:  "",
  city:         "",
  address:      "",
  time_start:   "08:00",
  time_end:     "20:00",
  logo:         null,
  fb: "", ig: "", wa: "", web: "",
}

/* ─── Validation par step ─────────────────────────────────── */
function validateStep1(v) {
  const e = {}
  if (!v.first_name.trim())  e.first_name  = "Champ requis"
  if (!v.last_name.trim())   e.last_name   = "Champ requis"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = "Email invalide"
  if (v.password.length < 8) e.password    = "8 caractères minimum"
  if (v.password !== v.password_confirmation)
    e.password_confirmation = "Les mots de passe ne correspondent pas"
  return e
}

function validateStep2(v) {
  const e = {}
  if (!v.agency_name.trim()) e.agency_name = "Champ requis"
  if (!v.city)               e.city        = "Sélectionnez une ville"
  if (!v.address.trim())     e.address     = "Champ requis"
  return e
}

/* ══════════════════════════════════════════════════════════════
   RegisterAgency — composant unique 2 steps (tabs)
══════════════════════════════════════════════════════════════ */
export default function RegisterAgency({ onBack }) {

  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const apiErrors   = useSelector(selectErrors)
  const globalError = useSelector(selectGlobalError)
  const isLoading   = useSelector(selectIsLoading)

  const [step, setStep]           = useState(1)          // 1 | 2
  const [step1Done, setStep1Done] = useState(false)      // tab 2 accessible ?
  const [values, setValues]       = useState(INITIAL)
  const [errors, setErrors]       = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ── Handlers génériques ─────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  /* ── Navigation tabs ─────────────────────────────────────── */
  const goToStep = (n) => {
    if (n === 2 && !step1Done) {
      // Valider step 1 avant de permettre l'accès
      const e = validateStep1(values)
      if (Object.keys(e).length > 0) { setErrors(e); return }
      setStep1Done(true)
    }
    dispatch(clearErrors())
    setErrors({})
    setStep(n)
  }

  const handleNextStep = () => {
    const e = validateStep1(values)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setStep1Done(true)
    dispatch(clearErrors())
    setErrors({})
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Valider les deux steps
    const e1 = validateStep1(values)
    const e2 = validateStep2(values)
    const allErrors = { ...e1, ...e2 }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      if (Object.keys(e1).length > 0) setStep(1)
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()

    /* Step 1 */
    formData.append("first_name",            values.first_name)
    formData.append("last_name",             values.last_name)
    formData.append("email",                 values.email)
    formData.append("phone",                 values.phone)
    formData.append("password",              values.password)
    formData.append("password_confirmation", values.password_confirmation)
    formData.append("role",                  "admin_agency")

    /* Step 2 */
    formData.append("agency_name", values.agency_name)
    formData.append("city",        values.city)
    formData.append("address",     values.address)
    formData.append("time_start",  values.time_start)
    formData.append("time_end",    values.time_end)

    /* Réseaux sociaux */
    const accounts = {}
    if (values.fb)  accounts.facebook  = values.fb
    if (values.ig)  accounts.instagram = values.ig
    if (values.wa)  accounts.whatsapp  = values.wa
    if (values.web) accounts.website   = values.web
    if (Object.keys(accounts).length > 0)
      formData.append("accounts_social", JSON.stringify(accounts))

    if (values.logo) formData.append("logo", values.logo)
    const result = await dispatch(registerAgencyThunk(formData))
    setIsSubmitting(false)

    if (registerAgencyThunk.fulfilled.match(result)) {
      navigate("/dashboard/agency")
    }
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="rp-view">

      {/* HEADER */}
      <div className="rp-fheader">
        <button type="button" className="rp-back" onClick={onBack}>
          <Icon.ArrowLeft /> Retour
        </button>
        <h1 className="rp-ftitle">
          Créer un compte <span className="rp-ftitle-accent">agence</span>
        </h1>
        <p className="rp-fsub">
          Remplissez les deux étapes pour créer votre compte.
        </p>
      </div>

      {/* TABS */}
      <div className="rp-tabs">
        <button
          type="button"
          className={`rp-tab${step === 1 ? " active" : ""}`}
          onClick={() => goToStep(1)}
        >
          <span className={`rp-tab-dot${step1Done ? " done" : step === 1 ? " active" : ""}`}>
            {step1Done ? <Icon.Check /> : "1"}
          </span>
          Informations personnelles
        </button>

        <div className="rp-tab-divider" />

        <button
          type="button"
          className={`rp-tab${step === 2 ? " active" : ""}${!step1Done ? " disabled" : ""}`}
          onClick={() => goToStep(2)}
          disabled={!step1Done}
        >
          <span className={`rp-tab-dot${step === 2 ? " active" : ""}`}>
            2
          </span>
          Informations agence
        </button>
      </div>

      {/* ERREUR GLOBALE */}
      {globalError && (
        <div className="rp-global-error">
          <Icon.Error /> {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ════════ STEP 1 ════════ */}
        <div style={{ display: step === 1 ? "block" : "none" }}>

          <div className="rp-row">
            <InputField
              label="Prénom" id="first_name" name="first_name"
              placeholder="Mohammed" icon={<Icon.User />}
              value={values.first_name} onChange={handleChange}
              error={errors.first_name || apiErrors?.first_name?.[0]}
            />
            <InputField
              label="Nom" id="last_name" name="last_name"
              placeholder="El Fassi" icon={<Icon.User />}
              value={values.last_name} onChange={handleChange}
              error={errors.last_name || apiErrors?.last_name?.[0]}
            />
          </div>

          <InputField
            label="Email" id="email" name="email" type="email"
            placeholder="contact@agence.ma" icon={<Icon.Mail />}
            value={values.email} onChange={handleChange}
            error={errors.email || apiErrors?.email?.[0]}
          />

          <InputField
            label="Téléphone" id="phone" name="phone" type="tel"
            placeholder="+212 06 00 00 00" icon={<Icon.Phone />}
            value={values.phone} onChange={handleChange}
            error={errors.phone || apiErrors?.phone?.[0]}
          />

          <div className="rp-group">
            <label className="rp-label">Mot de passe</label>
            <div className="rp-input-wrap">
              <span className="rp-icon"><Icon.Lock /></span>
              <PasswordInputInternal
                id="password" name="password"
                value={values.password} onChange={handleChange}
                error={errors.password}
              />
            </div>
            <PasswordStrength password={values.password} />
            {(errors.password || apiErrors?.password?.[0]) && (
              <span className="rp-errmsg show">
                <Icon.Error /> {errors.password || apiErrors?.password?.[0]}
              </span>
            )}
          </div>

          <InputField
            label="Confirmer le mot de passe"
            id="password_confirmation" name="password_confirmation"
            type="password" placeholder="••••••••" icon={<Icon.Lock />}
            value={values.password_confirmation} onChange={handleChange}
            error={errors.password_confirmation}
          />

          <div className="rp-btn-actions">
            <button
              type="button"
              className="rp-btn rp-btn-primary"
              onClick={handleNextStep}
            >
              Suivant <Icon.ArrowRight />
            </button>
          </div>

        </div>

        {/* ════════ STEP 2 ════════ */}
        <div style={{ display: step === 2 ? "block" : "none" }}>

          <InputField
            label="Nom de l'agence" id="agency_name" name="agency_name"
            placeholder="Ex: Elite Drive Casablanca" icon={<Icon.Building />}
            value={values.agency_name} onChange={handleChange}
            error={errors.agency_name || apiErrors?.agency_name?.[0]}
          />

          <div className="rp-row">
            <SelectField
              label="Ville" id="city" name="city"
              icon={<Icon.MapPin />}
              value={values.city} onChange={handleChange}
              options={VILLES}
              error={errors.city || apiErrors?.city?.[0]}
            />
            <InputField
              label="Code postal" id="postal_code" name="postal_code"
              placeholder="20000" icon={<Icon.MapPin />}
              value={values.postal_code ?? ""} onChange={handleChange}
            />
          </div>

          <InputField
            label="Adresse complète" id="address" name="address"
            placeholder="12 Rue Mohammed V, Casablanca" icon={<Icon.Home />}
            value={values.address} onChange={handleChange}
            error={errors.address || apiErrors?.address?.[0]}
          />

          <div className="rp-group">
            <label className="rp-label">Horaires d'ouverture</label>
            <div className="rp-time-row">
              <div className="rp-input-wrap">
                <span className="rp-icon"><Icon.Clock /></span>
                <input
                  type="time" name="time_start"
                  className="rp-input"
                  value={values.time_start} onChange={handleChange}
                />
              </div>
              <div className="rp-input-wrap">
                <span className="rp-icon"><Icon.Clock /></span>
                <input
                  type="time" name="time_end"
                  className="rp-input"
                  value={values.time_end} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="rp-group">
            <label className="rp-label">Logo de l'agence</label>
            <UploadLogo
              file={values.logo}
              onChange={(file) => setFieldValue("logo", file)}
            />
          </div>

          <div className="rp-group">
            <label className="rp-label">
              Réseaux sociaux
              <span style={{
                color: "var(--muted)", fontWeight: 400,
                textTransform: "none", marginLeft: 6,
              }}>
                (optionnel)
              </span>
            </label>
            <div className="rp-social-grid">
              {socialaccountlabel.map(s => (
                <div className="rp-input-wrap" key={s.k}>
                  <span className="rp-icon">{s.icon}</span>
                  <input
                    type="url" name={s.k}
                    className="rp-input"
                    placeholder={s.ph}
                    value={values[s.k] ?? ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rp-btn-actions">
            <button
              type="button"
              className="rp-btn rp-btn-outline"
              onClick={() => goToStep(1)}
            >
              <Icon.ArrowLeft /> Étape précédente
            </button>

            <button
              type="submit"
              className="rp-btn rp-btn-primary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <><div className="rp-spin" /> Création du compte…</>
              ) : (
                <><Icon.Building /> Créer le compte agence</>
              )}
            </button>
          </div>

        </div>

      </form>

      <div className="rp-login-link">
        Déjà un compte ?{" "}
        <Link to="/login">Se connecter</Link>
      </div>

    </div>
  )
}
