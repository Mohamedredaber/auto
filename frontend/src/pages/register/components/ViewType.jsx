import { useState } from "react";
import * as Icon from "../../../components/layout/icons";
import { Link } from "react-router-dom";
import typeclient from '../../../data/typeclient'
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
                {typeclient.map(card => (
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
                Déjà un compte ? 
                <Link to='/login'>Se connecter</Link>
            </div>
        </div>
    );
}
