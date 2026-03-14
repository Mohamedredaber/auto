import * as Icon from "../../../components/layout/icons";

export default function ViewSuccess({ type }) {
    return (
        <div className="rp-view rp-success">
            <div className="rp-success-icon"><Icon.Success /></div>
            <h2 className="rp-success-title">Compte créé avec succès !</h2>
            <p className="rp-success-desc">
                {type === "client"
                    ? "Bienvenue sur AutoConnect ! Votre compte client est prêt. Commencez à explorer les voitures disponibles au Maroc."
                    : "Votre compte agence est en cours de vérification. Nous vous contacterons dans les 24h pour finaliser votre inscription."}
            </p>
            <a href="#" className="rp-btn rp-btn-primary" style={{ maxWidth: 260, margin: "0 auto" }}>
                <Icon.Login /> Se connecter
            </a>
        </div>
    );
}
