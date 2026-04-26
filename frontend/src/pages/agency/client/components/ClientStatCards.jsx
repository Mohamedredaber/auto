import { Users, UserCheck, Calendar } from "lucide-react";

export default function ClientStatCards({ clientStats, clients }) {
  const totalClients = clientStats?.total_clients ?? clients?.length ?? 0;
  const totalBookings = clients?.reduce((acc, c) => acc + (c.bookings_count || 0), 0) ?? 0;
  const activeClients = clients?.filter((c) => c.bookings_count > 0).length ?? 0;

  const stats = [
    {
      mod: "blue",
      value: totalClients,
      label: "Total clients",
      delta: null,
      icon: (
        <Users size={20} />
      ),
    },
    {
      mod: "green",
      value: activeClients,
      label: "Clients actifs",
      delta: "up",
      icon: (
        <UserCheck size={20} />
      ),
    },
    {
      mod: "red",
      value: totalBookings,
      label: "Total réservations",
      delta: null,
      icon: (
        <Calendar size={20} />
      ),
    },
  ];

  return (
    <div className="ac-stats">
      {stats.map(({ mod, value, label, delta, icon }) => (
        <div className={`ac-stat-card ac-stat-card--${mod}`} key={label}>
          <div className="ac-stat-icon">{icon}</div>
          <div className="ac-stat-body">
            <div className="ac-stat-value">{value}</div>
            <div className="ac-stat-label">{label}</div>
            {delta && (
              <span className={`ac-stat-delta ac-stat-delta--${delta}`}>
                {delta === "up" && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
                Ce mois
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}