import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar"; // Sidebar li derna b CSS separé
import "../../styles/pages/dashboard.css";
const AgencyLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-wrapper">
        <main className="content-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
