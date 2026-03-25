import { Outlet } from "react-router-dom";

const AgencyLayout = () => {
  return (
    <div className="agency-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AgencyLayout;
