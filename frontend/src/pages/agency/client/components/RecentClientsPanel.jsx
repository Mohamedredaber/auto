import { avatarColor, initials } from "../utils";

export default function RecentClientsPanel({ recentClients = [] }) {
  const list = recentClients?.data ?? recentClients ?? [];

  return (
    <div className="ac-recent">
      <div className="ac-recent__head">
        <span className="ac-recent__title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Récents
        </span>
        <span className="ac-recent__badge">{list.length}</span>
      </div>

      <div className="ac-recent__list">
        {list.length === 0 ? (
          <div className="ac-recent__empty">Aucun client récent</div>
        ) : (
          list.map((client) => {
            const color = avatarColor(`${client.first_name} ${client.last_name}`);
            const init  = initials(client.first_name, client.last_name);
            return (
              <div className="ac-recent__item" key={client.id}>
                <div className="ac-avatar" style={{ background: color }}>{init}</div>
                <div className="ac-recent__info">
                  <div className="ac-recent__name">
                    {client.first_name} {client.last_name}
                  </div>
                  <div className="ac-recent__email">{client.email}</div>
                </div>
                <span className="ac-recent__count">
                  {client.bookings_count ?? 0} rés.
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}