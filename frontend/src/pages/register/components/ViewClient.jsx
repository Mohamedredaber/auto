import { useForm }         from "../../../hooks/useForm"
import * as Icon           from "../../../components/layout/icons"
import {
  InputField,
  PasswordInputInternal,
  PasswordStrength,
} from "./FormComponents"
import { Link }            from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"  // ✅ زيد useSelector
import { registerThunk }   from "../../../features/auth/authThunks"
import {
  selectErrors,
  selectGlobalError,
} from "../../../features/auth/authSelectors"

export default function ViewClient({ onBack, onSuccess }) {

  const dispatch    = useDispatch()
  const apiErrors   = useSelector(selectErrors)      // ✅ errors من Laravel
  const globalError = useSelector(selectGlobalError) // ✅ message عام

  // ── Initial values ─────────────────────
  const initialValues = {
    prenom:      "",
    nom:         "",
    email:       "",
    tel:         "",
    pass:        "",
    passConfirm: "",
  }

  // ── Validation locale ──────────────────
  const validate = (values) => {
    const e = {}
    if (!values.prenom.trim()) e.prenom = "Champ requis"
    if (!values.nom.trim())    e.nom    = "Champ requis"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Email invalide"
    if (values.pass.length < 8)
      e.pass = "8 caractères minimum"
    if (values.pass !== values.passConfirm)
      e.passConfirm = "Les mots de passe ne correspondent pas"
    return e
  }

  // ── Submit ─────────────────────────────
  const onSubmit = async (values) => {
    const data = {
      first_name:            values.prenom,
      last_name:             values.nom,
      email:                 values.email,
      phone:                 values.tel,
      password:              values.pass,
      password_confirmation: values.passConfirm,
      role:                  "client",
    }

    const result = await dispatch(registerThunk(data))

    if (registerThunk.fulfilled.match(result)) {
      onSuccess("client")
    }
  }

  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useForm({ initialValues, validate, onSubmit })

  return (
    <div className="rp-view">

      {/* Header */}
      <div className="rp-fheader">
        <button type="button" className="rp-back" onClick={onBack}>
          <Icon.ArrowLeft /> Retour
        </button>
        <h1 className="rp-ftitle">
          Créer un compte{" "}
          <span className="rp-ftitle-accent">Client</span>
        </h1>
        <p className="rp-fsub">
          Remplissez vos informations pour commencer à réserver.
        </p>
      </div>

      {globalError && (
        <div className="rp-global-error">
          <Icon.Error /> {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Prénom + Nom */}
        <div className="rp-row">
          <InputField
            label="Prénom"
            id="cPrenom"
            name="prenom"
            placeholder="Mohammed"
            icon={<Icon.User />}
            value={values.prenom}
            onChange={handleChange}
            error={errors.prenom || apiErrors?.first_name?.[0]}
          />
          <InputField
            label="Nom"
            id="cNom"
            name="nom"
            placeholder="El Fassi"
            icon={<Icon.User />}
            value={values.nom}
            onChange={handleChange}
            error={errors.nom || apiErrors?.last_name?.[0]}
          />
        </div>

        {/* Email */}
        <InputField
          label="Email"
          id="cEmail"
          name="email"
          type="email"
          placeholder="contact@exemple.ma"
          icon={<Icon.Mail />}
          value={values.email}
          onChange={handleChange}
          error={errors.email || apiErrors?.email?.[0]}
          // ✅ كيعرض "The email has already been taken"
        />

        {/* Téléphone */}
        <InputField
          label="Téléphone"
          id="cTel"
          name="tel"
          type="tel"
          placeholder="+212 06 00 00 00"
          icon={<Icon.Phone />}
          value={values.tel}
          onChange={handleChange}
          error={apiErrors?.phone?.[0]}
        />

        {/* Password */}
        <div className="rp-group">
          <label className="rp-label" htmlFor="cPass">
            Mot de passe
          </label>
          <div className="rp-input-wrap">
            <span className="rp-icon">
              <Icon.Lock />
            </span>
            <PasswordInputInternal
              id="cPass"
              name="pass"
              value={values.pass}
              onChange={handleChange}
              error={errors.pass}
            />
          </div>
          <PasswordStrength password={values.pass} />
          {(errors.pass || apiErrors?.password?.[0]) && (
            <span className="rp-errmsg show">
              <Icon.Error />
              {errors.pass || apiErrors?.password?.[0]}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <InputField
          label="Confirmer le mot de passe"
          id="cPassC"
          name="passConfirm"
          type="password"
          placeholder="••••••••"
          icon={<Icon.Lock />}
          value={values.passConfirm}
          onChange={handleChange}
          error={errors.passConfirm}
        />
        {/* Actions */}
        <div className="rp-btn-actions">
          <button
            type="submit"
            className="rp-btn rp-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><div className="rp-spin" /> Création en cours…</>
            ) : (
              <><Icon.Login /> Créer mon compte</>
            )}
          </button>

          <div className="rp-or">
            <span>ou continuer avec</span>
          </div>

          <button type="button" className="rp-btn rp-btn-google">
            <Icon.Google /> S'inscrire avec Google
          </button>
        </div>

      </form>

      {/* Footer */}
      <div className="rp-login-link">
        Déjà un compte ?{" "}
        <Link to="/login">Se connecter</Link>
      </div>

    </div>
  )
}