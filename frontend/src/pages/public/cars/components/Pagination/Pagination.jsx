import "../../../../../styles/components/pagination.css";
import { Button } from "../../../../../components/ui";

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  // Support deux formats : { currentPage, lastPage, total } et { current_page, last_page, total }
  const currentPage = pagination.currentPage ?? pagination.current_page ?? 1;
  const lastPage = pagination.lastPage ?? pagination.last_page ?? 1;
  const total = pagination.total ?? 0;
  const perPage = pagination.per_page ?? 12;

  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  // Afficher max 5 pages autour de la page courante
  const visiblePages = pages.filter(
    (p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1,
  );

  const withEllipsis = [];
  visiblePages.forEach((p, i) => {
    if (i > 0 && p - visiblePages[i - 1] > 1) {
      withEllipsis.push("...");
    }
    withEllipsis.push(p);
  });

  // Calcul du nombre d'éléments affichés
  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, total);

  return (
    <div className="pagination">
      <span className="pagination__info">
        Affichage de <strong>{startIndex}</strong>–<strong>{endIndex}</strong>{" "}
        sur <strong>{total}</strong> véhicules
      </span>

      <div className="pagination__controls">
        <Button
          size="sm"
          variant="secondary"
          className="pagination__btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Précédent
        </Button>

        {withEllipsis.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="pagination__ellipsis">
              …
            </span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === currentPage ? "primary" : "secondary"}
              className={`pagination__btn pagination__btn--page ${
                p === currentPage ? "pagination__btn--active" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          size="sm"
          variant="secondary"
          className="pagination__btn"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Suivant →
        </Button>
      </div>
    </div>
  );
}
