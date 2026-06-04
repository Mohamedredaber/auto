import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  Plus,
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  fetchAdminUsersThunk,
  deleteAdminUserThunk,
} from "../../features/adminUsers/adminUsersThunks";

import {
  selectAdminUsers,
  selectAdminUsersPagination,
  selectAdminUsersLoading,
  selectAdminUsersError,
} from "../../features/adminUsers/adminUsersSelectors";

import {
  setFilters,
  resetFilters,
} from "../../features/adminUsers/adminUsersSlice";

import "../../styles/pages/AdminAgenciesPage.css";

import {fetchAdminUsersStats} from "../../api/adminUserApi";


export default function AdminUsers() {
  const dispatch = useDispatch();

  const users = useSelector(selectAdminUsers);
  const pagination = useSelector(selectAdminUsersPagination);
  const loading = useSelector(selectAdminUsersLoading);
  const error = useSelector(selectAdminUsersError);

  const filters = useSelector((state) => state.adminUsers.filters);
  const initialStats = {
    total_users: 0,
    total_clients: 0,
    total_admin_agencies: 0,
    total_super_admins: 0,
  };
  const [userStats, setUserStats] = useState(initialStats);
  useEffect(() => {
    dispatch(fetchAdminUsersThunk(filters));
  }, [dispatch, filters]);

  const fetchStats = async () => {
    const response = await fetchAdminUsersStats();
      if (response.data && response.data.data) {
        const stats = response.data.data;
        setUserStats(stats);
      } else {
        console.error("Erreur lors de la récupération des statistiques utilisateurs");
      }
  };

    useEffect(() => {
        fetchStats();
    }, []);

  const totalUsers = userStats.total_users || 0;
  const totalClients = userStats.total_clients || 0;
  const totalAgencyAdmins = userStats.total_admin_agencies || 0;
  const totalSuperAdmins = userStats.total_super_admins || 0;

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    dispatch(
      setFilters({
        [name]: value,
        page: "",
      })
    );
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handlePage = (url) => {
    if (!url) return;

    const [, query] = url.split("?");
    const params = new URLSearchParams(query || "");

    dispatch(
      setFilters({
        page: params.get("page") || "",
      })
    );
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Supprimer l'utilisateur ?",
      text: `Voulez-vous vraiment supprimer "${user.first_name} ${user.last_name}" ?`,
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

    const response = await dispatch(deleteAdminUserThunk(user.id));

    if (!response.error) {
      await Swal.fire({
        icon: "success",
        title: "Utilisateur supprimé",
        text: "L'utilisateur a été supprimé avec succès.",
        timer: 1800,
        showConfirmButton: false,
        background: "#111827",
        color: "#f9fafb",
      });

      dispatch(fetchAdminUsersThunk(filters));
    }
  };

  return (
    <div className="admin-agencies-container animate-fade-in">
      <div className="admin-agencies-header">
        <div className="header-content">
          <div className="header-icon">
            <Users size={24} />
          </div>

          <div className="header-text">
            <h1>Gestion des utilisateurs</h1>
            <p>Suivi des clients, administrateurs agences et super admins.</p>
          </div>
        </div>

        <button className="btn-add">
          <Plus size={16} />
          Créer un utilisateur
        </button>
      </div>

      <div className="admin-agencies-stats">
        <div className="stat-card">
          <div className="stat-icon red">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total utilisateurs</span>
            <span className="stat-value">{totalUsers}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <UserCheck size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Clients</span>
            <span className="stat-value">{totalClients}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Building2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Admins agences</span>
            <span className="stat-value">{totalAgencyAdmins}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Super admins</span>
            <span className="stat-value">{totalSuperAdmins}</span>
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
            placeholder="Rechercher par nom, email ou téléphone , agence..."
          />
          <Search size={16} className="search-icon" />
        </div>

        <div className="filter-group">
          <Filter size={16} className="filter-icon text-gray-400" />
          <span>Filtrer par:</span>

          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="admin_agency">Admin agence</option>
            <option value="super_admin">Super admin</option>
          </select>

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
          <h2>Liste des utilisateurs</h2>
          {loading && <span className="table-status">Chargement...</span>}
          {error && <span className="table-status error">{error}</span>}
        </div>

        <div className="table-wrapper">
          <table className="admin-table agencies-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Agence</th>
                <th>Date création</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="agency-main">
                        <span className="agency-avatar">
                          <span className="agency-avatar-fallback">
                            {(user.first_name || "U").charAt(0)}
                          </span>
                        </span>

                        <div className="agency-info">
                          <span className="agency-name">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="agency-meta">ID: {user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{user.email || "-"}</td>
                    <td>{user.phone || "-"}</td>

                    <td>
                      <span className={`status-pill status-${user.role}`}>
                        {user.role === "client" && "Client"}
                        {user.role === "admin_agency" && "Admin agence"}
                        {user.role === "super_admin" && "Super admin"}
                      </span>
                    </td>

                    <td>{user.agency_name || "-"}</td>

                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button className="action-btn view" title="Voir détails">
                          <Eye size={16} />
                        </button>

                        <button className="action-btn edit" title="Modifier">
                          <Edit size={16} />
                        </button>

                        <button
                          className="action-btn delete"
                          title="Supprimer"
                          onClick={() => handleDeleteUser(user)}
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
    </div>
  );
}