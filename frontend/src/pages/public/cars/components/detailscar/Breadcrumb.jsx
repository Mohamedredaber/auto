import { Link } from "react-router-dom";

export default function Breadcrumb({ brand, model }) {
  return (
    <nav className="breadcrumb">
      <Link to="/" className="breadcrumb__link">Accueil</Link>
      <span className="breadcrumb__separator">›</span>
      <Link to="/cars" className="breadcrumb__link">Voitures</Link>
      <span className="breadcrumb__separator">›</span>
      <span className="breadcrumb__current">{brand} {model}</span>
    </nav>
  );
}