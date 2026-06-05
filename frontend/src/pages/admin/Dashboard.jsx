import { useEffect, useState } from "react";
import {
  Building2,
  Car,
  Users,
  CalendarCheck,
  DollarSign,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

import api from "../../api";
import "../../styles/pages/AdminDashboard.css";

const EMPTY_DASHBOARD = {
  totals: {
    total_agencies: 0,
    total_cars: 0,
    total_users: 0,
    total_bookings: 0,
    total_revenue: 0,
  },
  bookings_status: {
    pending: 0,
    confirmed: 0,
    completed: 0,
    canceled: 0,
  },
  cars_status: {
    available: 0,
    reserved: 0,
    maintenance: 0,
  },
  users_by_role: {
    clients: 0,
    admin_agencies: 0,
    super_admins: 0,
  },
  latest_bookings: [],
  latest_users: [],
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/super-admin/dashboard");
        setDashboard(response.data.data || EMPTY_DASHBOARD);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totals = dashboard.totals || EMPTY_DASHBOARD.totals;
  const bookingsStatus =
    dashboard.bookings_status || EMPTY_DASHBOARD.bookings_status;
  const carsStatus = dashboard.cars_status || EMPTY_DASHBOARD.cars_status;
  const usersByRole =
    dashboard.users_by_role || EMPTY_DASHBOARD.users_by_role;

  if (loading) {
    return <div className="admin-dashboard-page">Chargement du dashboard...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-page dashboard-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p>Vue globale de l’application, réservations, agences et utilisateurs.</p>
        </div>
      </div>

      <div className="dashboard-cards">
       <DashboardCard
          className="card-agencies"
          icon={<Building2 />}
          title="Total agences"
          value={totals.total_agencies}
        />

        <DashboardCard
          icon={<Car />}
          title="Total voitures"
          value={totals.total_cars}
        />

        <DashboardCard
          icon={<Users />}
          title="Total utilisateurs"
          value={totals.total_users}
        />

        <DashboardCard
          icon={<CalendarCheck />}
          title="Total réservations"
          value={totals.total_bookings}
        />

        <DashboardCard
          icon={<DollarSign />}
          title="Revenu total"
          value={`${Number(totals.total_revenue || 0).toLocaleString()} DH`}
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h2>État des réservations</h2>

          <div className="status-list">
            <StatusRow label="En attente" value={bookingsStatus.pending} />
            <StatusRow label="Confirmées" value={bookingsStatus.confirmed} />
            <StatusRow label="Terminées" value={bookingsStatus.completed} />
            <StatusRow label="Annulées" value={bookingsStatus.canceled} />
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>État des voitures</h2>

          <div className="status-list">
            <StatusRow label="Disponibles" value={carsStatus.available} />
            <StatusRow label="Réservées" value={carsStatus.reserved} />
            <StatusRow label="Maintenance" value={carsStatus.maintenance} />
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Utilisateurs par rôle</h2>

          <div className="status-list">
            <StatusRow label="Clients" value={usersByRole.clients} />
            <StatusRow label="Admins agences" value={usersByRole.admin_agencies} />
            <StatusRow label="Super admins" value={usersByRole.super_admins} />
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-panel">
          <h2>Dernières réservations</h2>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Voiture</th>
                  <th>Agence</th>
                  <th>Prix</th>
                  <th>Statut</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.latest_bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">
                      Aucune réservation.
                    </td>
                  </tr>
                ) : (
                  dashboard.latest_bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.user_name || "-"}</td>
                      <td>{booking.car_name || "-"}</td>
                      <td>{booking.agency_name || "-"}</td>
                      <td>{booking.total_price} DH</td>
                      <td>
                        <span className={`dashboard-status ${booking.status}`}>
                          {
                        booking.status === "pending"
                          ? "En attente"
                          : booking.status === "confirmed"
                          ? "Confirmée"
                          : booking.status === "canceled"
                          ? "Annulée"
                          : booking.status === "completed"
                          ? "Terminée"
                          : booking.status
                          }
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Derniers utilisateurs</h2>

          <div className="dashboard-users-list">
            {dashboard.latest_users.length === 0 ? (
              <p className="empty-row">Aucun utilisateur.</p>
            ) : (
              dashboard.latest_users.map((user) => (
                <div className="dashboard-user-item" key={user.id}>
                  <div className="dashboard-avatar">
                    {(user.first_name || "U").charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {user.first_name} {user.last_name}
                    </strong>
                    <p>{user.email}</p>
                  </div>

                  <span className={`role-pill role-${user.role}`}>
                      {user.role === "client"
                        ? "Client"
                        : user.role === "admin_agency"
                        ? "Admin Agence"
                        : "Super Admin"}
                    </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}