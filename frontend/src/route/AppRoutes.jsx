import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import RoleRoute from "./RoleRoute";
import VerificationRoute from "./VerificationRoute";

import Layout from "../components/layout/Layout";
import ClientLayout from "../components/layout/ClientLayout";
import AgencyLayout from "../components/layout/AgencyLayout";
import AdminLayout from "../components/layout/AdminLayout";

import Home from "../pages/home/Home";
import Contact from "../pages/contact/Contact";
import Cars from "../pages/public/cars/Cars";
import DetailsCars from "../pages/public/cars/DetailsCars";
import DetailsAgency from "../pages/public/agency/DetailsAgency";

import Login from "../pages/login/login";
import Register from "../pages/register/Register";
import ClientDashboard from "../pages/client/Dashboard";
import AgencyDashboard from "../pages/agency/dashboard/Dashboard";

import ReservationDashAgency from "../pages/agency/reservation/ReservationDashAgency"; 
import AgencyClient from "../pages/agency/client/AgencyClient";
import AgencyProfilePage from "../pages/agency/profile/AgencyProfilePage";
import Reservations from "../pages/client/reservation/ReservationPage";
import ReservationsClientDash from "../pages/client/reservation/ReservationsClientDash";
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import SettingClient from "../pages/client/setting/SettingClient";
import ProfileClient from "../pages/client/profile/ProfileClient";
import { ROLES } from "../constants/roles";
import MyCars from "../pages/agency/mycars/Mycars";
import ReservationPage from "../pages/client/reservation/ReservationPage";
import StatisticsPage from "../pages/agency/statistique/StatisticsPage";

// Admin Imports
import AdminDashboard from "../features/admin/dashboard/AdminDashboard";
import AdminAgencies from "../features/admin/agencies/AdminAgencies";
import AdminCars from "../features/admin/cars/AdminCars";
import AdminReservations from "../features/admin/reservations/AdminReservations";
import AdminUsers from "../features/admin/users/AdminUsers";
import AdminStatistics from "../features/admin/statistics/AdminStatistics";
import AdminSettings from "../features/admin/settings/AdminSettings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<DetailsCars />} />
        <Route path="/agency/:id" element={<DetailsAgency />} />  
        <Route element={<RoleRoute allowedRoles={[ROLES.CLIENT]} />}>
          <Route path="/reserve/:id" element={<ReservationPage />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[ROLES.CLIENT]} />}>
          <Route path="/reserver/:id" element={<ReservationPage />} />
          <Route element={<ClientLayout />}>
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route
              path="/dashboard/client/reservations"
              element={<ReservationsClientDash />}
            />
            <Route
              path="/dashboard/client/settings"
              element={<SettingClient />}
            />
            <Route
              path="/dashboard/client/profile"
              element={<ProfileClient />}
            />
          </Route>
        </Route>
        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN_AGENCY]} />}>
        <Route element={<VerificationRoute />}>
          <Route element={<AgencyLayout />}>
            <Route path="/dashboard/agency" element={<AgencyDashboard />} />
            <Route path="/dashboard/agency/cars" element={<MyCars />} />
            <Route
              path="/dashboard/agency/clients"
              element={<AgencyClient />}
            />
            <Route
              path="/dashboard/agency/profile"
              element={<AgencyProfilePage />}
            />
            <Route
              path="/dashboard/agency/statistics"
              element={<StatisticsPage />}
            />
            <Route
              path="/dashboard/agency/reservations"
              element={<ReservationDashAgency />}
            />
          </Route>
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/agencies" element={<AdminAgencies />} />
            <Route path="/dashboard/admin/cars" element={<AdminCars />} />
            <Route path="/dashboard/admin/reservations" element={<AdminReservations />} />
            <Route path="/dashboard/admin/users" element={<AdminUsers />} />
            <Route path="/dashboard/admin/statistics" element={<AdminStatistics />} />
            <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
