import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
