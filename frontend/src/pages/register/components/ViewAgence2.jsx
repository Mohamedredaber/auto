import { useForm } from "../../../hooks/useForm"
import * as Icon from "../../../components/layout/icons"
import { InputField, SelectField, UploadLogo } from "./FormComponents"
import { useDispatch, useSelector } from "react-redux"           // ✅ زيد
import { registerAgencyThunk } from "../../../features/auth/authThunks" // ✅ زيد
import {
  selectErrors,
  selectGlobalError,
} from "../../../features/auth/authSelectors"                    // ✅ زيد
import socialaccountlabel from "../../../data/socialaccountlabel"

const VILLES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger",
  "Agadir", "Meknès", "Oujda", "Tétouan", "Essaouira",
  "El Jadida", "Dakhla", "Laâyoune", "Béni Mellal",
]

export default function ViewAgence2({ onBack, onSuccess, agencyDraft }) { // ✅ زيد agencyDraft

  const dispatch    = useDispatch()
  const apiErrors   = useSelector(selectErrors)
  const globalError = useSelector(selectGlobalError)

  const initialFormValues = {
    nom: "", ville: "", cp: "", adresse: "",
    open: "08:00", close: "20:00",
    fb: "", ig: "", wa: "", web: "",
    logo: null,
  }

  const validate = (values) => {
    const e = {}
    if (!values.nom.trim())     e.nom     = "Champ requis"
    if (!values.ville)          e.ville   = "Sélectionnez une ville"
    if (!values.adresse.trim()) e.adresse = "Champ requis"
    return e
  }

  // ✅ onSubmit حقيقي — بدل setTimeout
  const onSubmit = async (values) => {

    const formData = new FormData()

    // ── Step 1 — من agencyDraft ──────────
    formData.append("first_name",            agencyDraft.prenom)
    formData.append("last_name",             agencyDraft.nom)
    formData.append("email",                 agencyDraft.email)
    formData.append("phone",                 agencyDraft.tel)
    formData.append("password",              agencyDraft.pass)
    formData.append("password_confirmation", agencyDraft.passConfirm)
    formData.append("role",                  "admin_agency")

    // ── Step 2 ───────────────────────────
    formData.append("agency_name", values.nom)
    formData.append("city",        values.ville)
    formData.append("address",     values.adresse)
    formData.append("time_start",  values.open)
    formData.append("time_end",    values.close)
    if (values.cp) formData.append("postal_code", values.cp)

    // ── Réseaux sociaux ──────────────────
    const accounts = {}
    if (values.fb)  accounts.facebook  = values.fb
    if (values.ig)  accounts.instagram = values.ig
    if (values.wa)  accounts.whatsapp  = values.wa
    if (values.web) accounts.website   = values.web
    if (Object.keys(accounts).length > 0) {
      formData.append("accounts_social", JSON.stringify(accounts))
    }

    // ── Logo ─────────────────────────────
    if (values.logo) formData.append("logo", values.logo)

    // ✅ Call واحد فقط
    const result = await dispatch(registerAgencyThunk(formData))

    if (registerAgencyThunk.fulfilled.match(result)) {
      onSuccess("agence")
    }
  }

  const {
    values, errors, isSubmitting,
    handleChange, setFieldValue, handleSubmit,
  } = useForm({ initialValues: initialFormValues, validate, onSubmit })

  return (
    <div className="rp-view">
      <div className="rp-fheader">
        <button type="button" className="rp-back" onClick={onBack}>
          <Icon.ArrowLeft /> Étape précédente
        </button>
        <h1 className="rp-ftitle">
          Informations <span className="rp-ftitle-accent">agence</span>
        </h1>
        <p className="rp-fsub">
          Présentez votre agence aux clients sur la plateforme.
        </p>
      </div>

      {/* ✅ Global error */}
      {globalError && (
        <div className="rp-global-error">
          <Icon.Error /> {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        <InputField
          label="Nom de l'agence" id="agNom" name="nom"
          placeholder="Ex: Elite Drive Casablanca"
          icon={<Icon.Building />}
          value={values.nom} onChange={handleChange}
          error={errors.nom || apiErrors?.agency_name?.[0]}
        />

        <div className="rp-row">
          <SelectField
            label="Ville" id="agVille" name="ville"
            icon={<Icon.MapPin />}
            value={values.ville} onChange={handleChange}
            options={VILLES}
            error={errors.ville || apiErrors?.city?.[0]}
          />
          <InputField
            label="Code postal" id="agCP" name="cp"
            placeholder="20000" icon={<Icon.MapPin />}
            value={values.cp} onChange={handleChange}
          />
        </div>

        <InputField
          label="Adresse complète" id="agAddr" name="adresse"
          placeholder="12 Rue Mohammed V, Casablanca"
          icon={<Icon.Home />}
          value={values.adresse} onChange={handleChange}
          error={errors.adresse || apiErrors?.address?.[0]}
        />

        <div className="rp-group">
          <label className="rp-label">Horaires d'ouverture</label>
          <div className="rp-time-row">
            <div className="rp-input-wrap">
              <span className="rp-icon"><Icon.Clock /></span>
              <input
                type="time" name="open"
                className="rp-input"
                value={values.open} onChange={handleChange}
              />
            </div>
            <div className="rp-input-wrap">
              <span className="rp-icon"><Icon.Clock /></span>
              <input
                type="time" name="close"
                className="rp-input"
                value={values.close} onChange={handleChange}
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
                  value={values[s.k]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rp-btn-actions">
          <button
            type="submit"
            className="rp-btn rp-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><div className="rp-spin" /> Création du compte…</>
            ) : (
              <><Icon.Building /> Créer le compte agence</>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}