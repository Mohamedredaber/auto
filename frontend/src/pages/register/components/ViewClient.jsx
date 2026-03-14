import { useForm } from "../../../hooks/useForm";
import * as Icon from "../../../components/layout/icons";
import { InputField, PasswordInputInternal, PasswordStrength } from "./FormComponents";

export default function ViewClient({ onBack, onSuccess }) {
    const initialValues = { prenom: "", nom: "", email: "", tel: "", pass: "", passConfirm: "" };

    const validate = (values) => {
        const e = {};
        if (!values.prenom.trim()) e.prenom = "Champ requis";
        if (!values.nom.trim()) e.nom = "Champ requis";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Email invalide";
        if (values.pass.length < 8) e.pass = "8 caractères minimum";
        if (values.pass !== values.passConfirm) e.passConfirm = "Les mots de passe ne correspondent pas";
        return e;
    };

    const onSubmit = async (values) => {
        // Si on a besoin de formater ou d'envoyer
        await new Promise(r => setTimeout(r, 1400));
        onSuccess("client");
    };

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues,
        validate,
        onSubmit
    });

    return (
        <div className="rp-view">
            <div className="rp-fheader">
                <button type="button" className="rp-back" onClick={onBack}>
                    <Icon.ArrowLeft /> Retour
                </button>
                <h1 className="rp-ftitle">Créer un compte <span className="rp-ftitle-accent">Client</span></h1>
                <p className="rp-fsub">Remplissez vos informations pour commencer à réserver.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="rp-row">
                    <InputField label="Prénom" id="cPrenom" name="prenom" placeholder="Mohammed" icon={<Icon.User />} value={values.prenom} onChange={handleChange} error={errors.prenom} />
                    <InputField label="Nom" id="cNom" name="nom" placeholder="El Fassi" icon={<Icon.User />} value={values.nom} onChange={handleChange} error={errors.nom} />
                </div>
                <InputField label="Email" id="cEmail" name="email" type="email" placeholder="contact@exemple.ma" icon={<Icon.Mail />} value={values.email} onChange={handleChange} error={errors.email} />
                <InputField label="Téléphone" id="cTel" name="tel" type="tel" placeholder="+212 06 00 00 00" icon={<Icon.Phone />} value={values.tel} onChange={handleChange} />

                <div className="rp-group">
                    <label className="rp-label" htmlFor="cPass">Mot de passe</label>
                    <div className="rp-input-wrap">
                        <span className="rp-icon"><Icon.Lock /></span>
                        <PasswordInputInternal id="cPass" name="pass" value={values.pass} onChange={handleChange} error={errors.pass} />
                    </div>
                    <PasswordStrength password={values.pass} />
                    {errors.pass && <span className="rp-errmsg show"><Icon.Error /> {errors.pass}</span>}
                </div>

                <InputField label="Confirmer le mot de passe" id="cPassC" name="passConfirm" type="password" placeholder="••••••••" icon={<Icon.Lock />} value={values.passConfirm} onChange={handleChange} error={errors.passConfirm} />

                <div className="rp-btn-actions">
                    <button type="submit" className="rp-btn rp-btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? <><div className="rp-spin" /> Création en cours…</> : <><Icon.Login /> Créer mon compte</>}
                    </button>
                    <div className="rp-or"><span>ou continuer avec</span></div>
                    <button type="button" className="rp-btn rp-btn-google">
                        <Icon.Google /> S'inscrire avec Google
                    </button>
                </div>
            </form>

            <div className="rp-login-link">
                Déjà un compte ? <a href="#">Se connecter</a>
            </div>
        </div>
    );
}
