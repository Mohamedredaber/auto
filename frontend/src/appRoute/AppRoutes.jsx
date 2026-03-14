import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/login/login";
import Register from "../pages/register/Register";
import Contact from "../pages/contact/Contact";
import Cars from "../pages/cars/Cars";
import Layout from "../components/layout/Layout";
function AppRoutes() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<Cars />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
