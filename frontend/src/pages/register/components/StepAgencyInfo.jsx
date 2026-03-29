import { useForm }         from "../../../hooks/useForm"
import * as Icon           from "../../../components/layout/icons"
import {
  InputField,
  PasswordInputInternal,
  PasswordStrength,
} from "./FormComponents"
import { Link }            from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { saveAgencyDraft } from "../../../features/auth/authSlice"
import { registerThunk }   from "../../../features/auth/authThunks"
import {
  selectErrors,
  selectGlobalError,
} from "../../../features/auth/authSelectors"

export default function StepAgencyInfo({ onBack, onNext }) {

  const dispatch = useDispatch()
  const apiErrors   = useSelector(selectErrors)
  const globalError = useSelector(selectGlobalError)

  const initialValues = {
    prenom:      "",
    nom:         "",
    email:       "",
    tel:         "",
    pass:        "",
    passConfirm: "",
  }

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
  
  const onSubmit = async (values) => {
    const data = {
      first_name:            values.prenom,
      last_name:             values.nom,
      email:                 values.email,
      phone:                 values.tel,
      password:              values.pass,
      password_confirmation: values.passConfirm,
      role:                  "admin_agency",
    }

    const result = await dispatch(registerThunk(data))

    if (registerThunk.fulfilled.match(result)) {
      // ✅ Sauvegarde dans Redux pour Step 2
      dispatch(saveAgencyDraft(values))
      onNext(values)
    }
  }

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit,
  })

  return (
    <div className="rp-view">
      <div className="rp-fheader">
        <button type="button" className="rp-back" onClick={onBack}>
          <Icon.ArrowLeft /> Retour
        </button>
        <h1 className="rp-ftitle">
          Informations{" "}
          <span className="rp-ftitle-accent">personnelles</span>
        </h1>
        <p className="rp-fsub">
          Vos informations de connexion pour le compte agence.
        </p>
      </div>

      {globalError && (
        <div className="rp-global-error">
          <Icon.Error /> {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="rp-row">
          <InputField
            label="Prénom" id="aPrenom" name="prenom"
            placeholder="Mohammed" icon={<Icon.User />}
            value={values.prenom} onChange={handleChange}
            error={errors.prenom || apiErrors?.first_name?.[0]}
          />
          <InputField
            label="Nom" id="aNom" name="nom"
            placeholder="El Fassi" icon={<Icon.User />}
            value={values.nom} onChange={handleChange}
            error={errors.nom || apiErrors?.last_name?.[0]}
          />
        </div>

        <InputField
          label="Email" id="aEmail" name="email" type="email"
          placeholder="contact@agence.ma" icon={<Icon.Mail />}
          value={values.email} onChange={handleChange}
          error={errors.email || apiErrors?.email?.[0]}
        />

        <InputField
          label="Téléphone" id="aTel" name="tel" type="tel"
          placeholder="+212 06 00 00 00" icon={<Icon.Phone />}
          value={values.tel} onChange={handleChange}
          error={apiErrors?.phone?.[0]}
        />

        <div className="rp-group">
          <label className="rp-label">Mot de passe</label>
          <div className="rp-input-wrap">
            <span className="rp-icon"><Icon.Lock /></span>
            <PasswordInputInternal
              id="aPass" name="pass"
              value={values.pass} onChange={handleChange}
              error={errors.pass}
            />
          </div>
          <PasswordStrength password={values.pass} />
          {(errors.pass || apiErrors?.password?.[0]) && (
            <span className="rp-errmsg show">
              <Icon.Error /> {errors.pass || apiErrors?.password?.[0]}
            </span>
          )}
        </div>

        <InputField
          label="Confirmer le mot de passe"
          id="aPassC" name="passConfirm" type="password"
          placeholder="••••••••" icon={<Icon.Lock />}
          value={values.passConfirm} onChange={handleChange}
          error={errors.passConfirm}
        />

        <div className="rp-btn-actions">
          <button
            type="submit"
            className="rp-btn rp-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><div className="rp-spin" /> Vérification…</>
            ) : (
              <>Suivant <Icon.ArrowRight /></>
            )}
          </button>
        </div>
      </form>

      <div className="rp-login-link">
        Déjà un compte ?{" "}
        <Link to="/login">Se connecter</Link>
      </div>
    </div>
  )
}
