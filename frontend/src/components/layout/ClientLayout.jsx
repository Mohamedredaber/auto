import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div className="client-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
