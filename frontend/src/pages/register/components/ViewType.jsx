import { useState } from "react";
import * as Icon from "../../../components/layout/icons";

export default function ViewType({ onSelect }) {
    const [hov, setHov] = useState(null);
    return (
        <div className="rp-view">
            <div className="rp-fheader">
                <h1 className="rp-ftitle">
                    Bienvenue sur <span className="rp-ftitle-accent">AutoConnect</span>
                </h1>
                <p className="rp-fsub">Choisissez le type de compte que vous souhaitez créer pour commencer l'aventure.</p>
            </div>

            <div className="rp-type-grid">
                {[
                    { key: "client", icon: <Icon.User />, title: "Client", desc: "Réservez facilement votre voiture idéale au Maroc" },
                    { key: "agence", icon: <Icon.Agency />, title: "Agence", desc: "Publiez et gérez votre flotte de véhicules" },
                ].map(card => (
                    <div
                        key={card.key}
                        className={`rp-type-card${hov === card.key ? " sel" : ""}`}
                        onMouseEnter={() => setHov(card.key)}
                        onMouseLeave={() => setHov(null)}
                        onClick={() => onSelect(card.key)}
                    >
                        <div className="rp-type-check"><Icon.Check /></div>
                        <div className="rp-type-icon">{card.icon}</div>
                        <div className="rp-type-title">{card.title}</div>
                        <div className="rp-type-desc">{card.desc}</div>
                    </div>
                ))}
            </div>

            <div className="rp-login-link">
                Déjà un compte ? <a href="#">Se connecter</a>
            </div>
        </div>
    );
}
