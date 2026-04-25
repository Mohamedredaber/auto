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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      mod: "green",
      value: activeClients,
      label: "Clients actifs",
      delta: "up",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      ),
    },
    {
      mod: "red",
      value: totalBookings,
      label: "Total réservations",
      delta: null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
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