import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar"; // Sidebar li derna b CSS separé
import "../../styles/pages/dashboard.css";
import TopBar from "./topbar/TopBar"; // TopBa
const ClientLayout = () => {
  return (
     <div className="dashboard-layout">
      <Sidebar />
      <div className="main-wrapper">
      <TopBar />

        <main className="content-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;

