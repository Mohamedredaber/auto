import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import RoleRoute from "./RoleRoute";

import Layout from "../components/layout/Layout";
import ClientLayout from "../components/layout/ClientLayout";
import AgencyLayout from "../components/layout/AgencyLayout";
import AdminLayout from "../components/layout/AdminLayout";

import Home from "../pages/home/Home";
import Contact from "../pages/contact/Contact";
import Cars from "../pages/public/cars/Cars";
import DetailsCars from "../pages/public/cars/DetailsCars";

import Login from "../pages/login/login";
import Register from "../pages/register/Register";
import ClientDashboard from "../pages/client/Dashboard";
import AgencyDashboard from "../pages/agency/dashboard/Dashboard";

import ReservationDashAgency from "../pages/agency/reservation/ReservationDashAgency"; 
import AgencyClient from "../pages/agency/client/AgencyClient";
import AdminDashboard from "../pages/admin/Dashboard";
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
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<DetailsCars />} />
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
          <Route element={<AgencyLayout />}>
            <Route path="/dashboard/agency" element={<AgencyDashboard />} />
            <Route path="/dashboard/agency/cars" element={<MyCars />} />
            <Route
              path="/dashboard/agency/clients"
              element={<AgencyClient />}
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

        <Route element={<RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
