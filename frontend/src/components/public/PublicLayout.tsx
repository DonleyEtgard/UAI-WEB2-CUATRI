import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <div className="sticky top-0 z-50">
        <PublicNavbar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <div className="h-1" />
    </div>
  );
};

export default PublicLayout;