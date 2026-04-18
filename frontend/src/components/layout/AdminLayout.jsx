import { Outlet } from "react-router-dom";
import Sidebaradmin from "./sidebar/Sidebaradmin"; // Sidebar li derna b CSS separé
import "../../styles/pages/dashboard.css";
import TopBaradmin from "./topbar/TopBaradmin"; // T
const AdminLayout = () => {
  return (
   <div className="dashboard-layout">
      <Sidebaradmin />
      <div className="main-wrapper">
      <TopBaradmin />
        <main className="content-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
