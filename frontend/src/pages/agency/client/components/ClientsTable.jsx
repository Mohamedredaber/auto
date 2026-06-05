import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchAgencyClients } from "../../../../features/agency/agencyClientsThunks";
import { avatarColor, initials, formatDate } from "../utils";

const FILTERS = [
  { key: "all",    label: "Tous" },
  { key: "active", label: "Actifs" },
  { key: "new",    label: "Nouveaux" },
];

export default function ClientsTable({ clients = [], meta, filters, loading }) {
  const dispatch = useDispatch();
  const [search, setSearch]     = useState(filters?.search || "");
  const [activeFilter, setFilter] = useState(filters?.filter || "all");

  // Client-side filtering (le dispatch vers l'API peut être ajouté selon les endpoints dispo)
  const filtered = useMemo(() => {
    let list = [...clients];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      );
    }
    if (activeFilter === "active") list = list.filter((c) => c.bookings_count > 0);
    if (activeFilter === "new")    list = list.filter((c) => c.bookings_count === 0);
    return list;
  }, [clients, search, activeFilter]);

  const currentPage = meta?.current_page ?? 1;
  const lastPage    = meta?.last_page    ?? 1;
  const total       = meta?.total        ?? clients.length;

  const handlePage = (page) => {
    dispatch(fetchAgencyClients({ page }));
  };

  return (
    <div className="ac-table-section">
      {/* Toolbar */}
      <div className="ac-toolbar">
        <span className="ac-toolbar__title">Tous les clients</span>

        {/* Search */}
        <div className="ac-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter pills */}
        <div className="ac-filter-pills">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`ac-pill${activeFilter === key ? " ac-pill--active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Réservations</th>
              <th>Inscrit le</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="agency-clients__loading" style={{ minHeight: 200 }}>
                    <div className="ac-spinner" />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="ac-table__empty">
                    <div className="ac-table__empty-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      </svg>
                    </div>
                    <p>Aucun client trouvé</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((client) => {
                const color = avatarColor(`${client.first_name} ${client.last_name}`);
                const init  = initials(client.first_name, client.last_name);
                return (
                  <tr key={client.id}>
                    {/* Client */}
                    <td>
                      <div className="ac-table__client">
                        <div className="ac-avatar" style={{ background: color, width: 34, height: 34, fontSize: "0.75rem" }}>
                          {init}
                        </div>
                        <div className="ac-table__client-info">
                          <div className="ac-table__client-name">
                            {client.first_name} {client.last_name}
                          </div>
                          <div className="ac-table__client-email">{client.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Téléphone */}
                    <td>
                      <span className="ac-table__phone">
                        {client.phone || "—"}
                      </span>
                    </td>

                    {/* Rôle */}
                    <td>
                      <span className={`ac-role-badge ac-role-badge--${client.role || "client"}`}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                          <circle cx="4" cy="4" r="4" />
                        </svg>
                        {client.role || "client"}
                      </span>
                    </td>

                    {/* Réservations */}
                    <td>
                      <span className="ac-bookings-count">
                        {client.bookings_count ?? 0}
                        <span>rés.</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="ac-table__date">
                        {formatDate(client.created_at)}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      <button className="ac-action-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Voir
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lastPage > 1 || total > 0 ? (
        <div className="ac-pagination">
          <span className="ac-pagination__info">
            <strong>{filtered.length}</strong> sur <strong>{total}</strong> clients
          </span>
          <div className="ac-pagination__controls">
            <button
              className="ac-page-btn"
              onClick={() => handlePage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`ac-page-btn${currentPage === page ? " ac-page-btn--active" : ""}`}
                onClick={() => handlePage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="ac-page-btn"
              onClick={() => handlePage(currentPage + 1)}
              disabled={currentPage >= lastPage}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}