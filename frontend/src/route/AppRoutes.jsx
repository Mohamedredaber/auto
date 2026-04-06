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
import Cars from "../pages/cars/Cars";
import Login from "../pages/login/login";
import Register from "../pages/register/Register";
import ClientDashboard from "../pages/client/Dashboard";
import AgencyDashboard from "../pages/agency/dashboard/Dashboard";
import AgencyClient from "../pages/agency/client/AgencyClient";
import AdminDashboard from "../pages/admin/Dashboard";

import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import { ROLES } from "../constants/roles";
import Reservations from "../pages/agency/reservations/Reservations";
import MyCars from "../pages/agency/mycars/Mycars";
export default function AppRoutes() {
  return (
    <Routes>
      {/* ══════════════════════════
          PUBLIC
      ══════════════════════════ */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cars" element={<Cars />} />

        {/* Guests uniquement (non connectés) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* ══════════════════════════
          PROTECTED (connecté)
      ══════════════════════════ */}
      <Route element={<ProtectedRoute />}>
        {/* CLIENT */}
        <Route element={<RoleRoute allowedRoles={[ROLES.CLIENT]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/dashboard/client" element={<ClientDashboard />} />
          </Route>
        </Route>

        {/* AGENCY */}
        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN_AGENCY]} />}>
          <Route element={<AgencyLayout />}>
            <Route path="/dashboard/agency" element={<AgencyDashboard />} />
            <Route path="/dashboard/agency/cars" element={<MyCars />} />
            <Route
              path="/dashboard/agency/clients"
              element={<AgencyClient />}
            />
            <Route
              path="/dashboard/agency/reservations"
              element={<Reservations />}
            />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route element={<RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* ══════════════════════════
          ERRORS
      ══════════════════════════ */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
