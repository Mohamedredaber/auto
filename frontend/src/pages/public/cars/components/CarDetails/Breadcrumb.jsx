import { Link, useParams } from "react-router-dom";
import { ChevronRightIcon } from "../../../../../components/layout/icons";
import "../../../styles/components/breadcrumb-details.css";

export default function Breadcrumb({ car }) {
  const { id } = useParams();

  return (
    <nav className="breadcrumb">
      <div className="breadcrumb__container">
        <Link to="/" className="breadcrumb__link">
          Accueil
        </Link>
        <ChevronRightIcon className="breadcrumb__separator" />

        <Link to="/cars" className="breadcrumb__link">
          Voitures
        </Link>
        <ChevronRightIcon className="breadcrumb__separator" />

        <span className="breadcrumb__current">
          {car?.brand} {car?.model}
        </span>
      </div>
    </nav>
  );
}
