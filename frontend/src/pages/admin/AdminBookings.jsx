import { useEffect , useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  fetchAdminBookingsThunk,
  fetchAdminBookingsStatsThunk,
  deleteAdminBookingThunk,
} from "../../features/adminBookings/adminBookingsThunks";

import {
  selectAdminBookings,
  selectAdminBookingsStats,
  selectAdminBookingsFilters,
  selectAdminBookingsPagination,
  selectAdminBookingsLoading,
  selectAdminBookingsError
} from "../../features/adminBookings/adminBookingsSelectors";
import {
    
  setBookingFilters,
  resetBookingFilters,
} from "../../features/adminBookings/adminBookingsSlice";

import "../../styles/pages/AdminAgenciesPage.css";
import BookingForm from "../../components/admin/BookingForm";
import {
  createAdminBookingThunk,
  updateAdminBookingThunk,
} from "../../features/adminBookings/adminBookingsThunks";

const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  canceled: "Annulée",
  completed: "Terminée",
};

export default function AdminBookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bookings = useSelector(selectAdminBookings) || [];
    const stats = useSelector(selectAdminBookingsStats) || {
    total_bookings: 0,
    total_pending: 0,
    total_confirmed: 0,
    total_canceled: 0,
    total_completed: 0,
    total_revenue: 0,
    };
  const filters = useSelector(selectAdminBookingsFilters);
  const pagination = useSelector(selectAdminBookingsPagination);
  const loading = useSelector(selectAdminBookingsLoading);
  const error = useSelector(selectAdminBookingsError);

  const [formOpen, setFormOpen] = useState(false);
const [formMode, setFormMode] = useState("create");
const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminBookingsStatsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminBookingsThunk(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      setBookingFilters({
        [name]: value,
        page: "",
      })
    );
  };

  const handleReset = () => {
    dispatch(resetBookingFilters());
  };

  const handlePage = (url) => {
    if (!url) return;

    const [, query] = url.split("?");
    const params = new URLSearchParams(query || "");

    dispatch(
      setBookingFilters({
        page: params.get("page") || "",
      })
    );
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/admin/bookings/${id}`);
  };

  const handleDeleteBooking = async (booking) => {
    const result = await Swal.fire({
      title: "Supprimer la réservation ?",
      text: `Voulez-vous vraiment supprimer la réservation #${booking.id} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
      reverseButtons: true,
      background: "#111827",
      color: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    const response = await dispatch(deleteAdminBookingThunk(booking.id));

    if (!response.error) {
      await Swal.fire({
        icon: "success",
        title: "Réservation supprimée",
        timer: 1500,
        showConfirmButton: false,
        background: "#111827",
        color: "#f9fafb",
      });

      dispatch(fetchAdminBookingsThunk(filters));
      dispatch(fetchAdminBookingsStatsThunk());
    }
  };

  const handleFormSubmit = async (values) => {

    
  if (formMode === "edit" && selectedBooking?.id) {
    await dispatch(
      updateAdminBookingThunk({
        id: selectedBooking.id,
        bookingData: values,
      })    
    ).unwrap();
  } else {
    await dispatch(createAdminBookingThunk(values)).unwrap();
  }

  setFormOpen(false);
  setSelectedBooking(null);

  dispatch(fetchAdminBookingsThunk(filters));
  dispatch(fetchAdminBookingsStatsThunk());
};
  return (
    <div className="admin-agencies-container animate-fade-in">
      <div className="admin-agencies-header">
        <div className="header-content">
          <div className="header-icon">
            <CalendarCheck size={24} />
          </div>

          <div className="header-text">
            <h1>Gestion des réservations</h1>
            <p>Suivi global des réservations, statuts et revenus.</p>
          </div>
        </div>

        <button
        className="btn-add"
        onClick={() => {
            setFormMode("create");
            setSelectedBooking(null);
            setFormOpen(true);
        }}
        >
        <Plus size={16} />
        Créer une réservation
        </button>
      </div>

      <div className="admin-agencies-stats">
        <div className="stat-card">
          <div className="stat-icon red">
            <CalendarCheck size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total réservations</span>
            <span className="stat-value">{stats.total_bookings}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">En attente</span>
            <span className="stat-value">{stats.total_pending}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Confirmées</span>
            <span className="stat-value">{stats.total_confirmed}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Revenus</span>
            <span className="stat-value">{stats.total_revenue} MAD</span>
          </div>
        </div>
      </div>

      <div className="admin-agencies-filters">
        <div className="search-box">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Rechercher client, voiture ou agence"
          />
          <Search size={16} className="search-icon" />
        </div>

        <div className="filter-group">
          <Filter size={16} className="filter-icon text-gray-400" />
          <span>Filtrer par:</span>

          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="canceled">Annulée</option>
            <option value="completed">Terminée</option>
          </select>
       <div className="date-filters">
  <div className="date-filter">
    <label>Du : </label>
    <input
      type="date"
      name="start_date"
      value={filters.start_date}
      onChange={handleFilterChange}
    />
  </div>

  <div className="date-filter">
    <label>Au : </label>
    <input
      type="date"
      name="end_date"
      value={filters.end_date}
      onChange={handleFilterChange}
    />
  </div>
</div>

          <select
            name="per_page"
            value={filters.per_page}
            onChange={handleFilterChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <button className="btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="admin-agencies-table">
        <div className="table-header">
          <h2>Liste des réservations</h2>
          {loading && <span className="table-status">Chargement...</span>}
          {error && <span className="table-status error">{error}</span>}
        </div>

        <div className="table-wrapper">
          <table className="admin-table agencies-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Voiture</th>
                <th>Agence</th>
                <th>Période</th>
                <th>Prix total</th>
                <th>Statut</th>
                <th>Date création</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="no-data">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="agency-info">
                        <span className="agency-name">
                          {booking.user_name || "-"}
                        </span>
                        <span className="agency-meta">
                          {booking.user_email || "-"}
                        </span>
                      </div>
                    </td>

                    <td>{booking.car_name || "-"}</td>
                    <td>{booking.agency_name || "-"}</td>

                    <td>
                      {booking.start_date} → {booking.end_date}
                    </td>

                    <td>{booking.total_price} MAD</td>

                    <td>
                      <span className={`status-pill status-${booking.status}`}>
                        {STATUS_LABELS[booking.status] || booking.status}
                      </span>
                    </td>

                    <td>
                      {booking.created_at
                        ? new Date(booking.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button className="action-btn view" title="Voir détails"
                        onClick={() => handleViewDetails(booking.id)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                    className="action-btn edit"
                    title="Modifier"
                    onClick={() => {
                        setFormMode("edit");
                        setSelectedBooking(booking);
                        setFormOpen(true);
                    }}
                    >
                    <Edit size={16} />
                    </button>

                        <button
                          className="action-btn delete"
                          title="Supprimer"
                          onClick={() => handleDeleteBooking(booking)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="pagination-container">
            <div className="pagination-info">
              Page {pagination.current_page} / {pagination.last_page}
            </div>

            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePage(pagination.prev_page_url)}
                disabled={!pagination.prev_page_url}
              >
                Précédent
              </button>

              <button
                className="pagination-btn"
                onClick={() => handlePage(pagination.next_page_url)}
                disabled={!pagination.next_page_url}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      <BookingForm
  isOpen={formOpen}
  mode={formMode}
  initialData={selectedBooking}
  onSubmit={handleFormSubmit}
  onClose={() => {
    setFormOpen(false);
    setSelectedBooking(null);
    setFormMode("create");
  }}
/>
    </div>
  );
}