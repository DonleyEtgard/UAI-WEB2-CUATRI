const UserRolesPage = () => {
  return (
    <div className="container space-y-6">

      {/* HEADER */}
      <div>
        <h1>Role Management</h1>
        <p className="text-muted">
          Define access levels and permissions for each role
        </p>
      </div>

      {/* ROLES CARD */}
      <div className="card space-y-4">

        {/* ADMIN */}
        <div className="flex-between" style={{ paddingBottom: "10px", borderBottom: "1px solid #1f2937" }}>
          <div>
            <p className="font-semibold">Admin</p>
            <p className="text-muted-sm">
              Full system access and management
            </p>
          </div>

          <span className="badge badge-success">
            Full Access
          </span>
        </div>

        {/* EMPLOYEE */}
        <div className="flex-between">
          <div>
            <p className="font-semibold">Employee</p>
            <p className="text-muted-sm">
              Access limited to sales operations
            </p>
          </div>

          <span className="badge badge-warning">
            Sales Only
          </span>
        </div>

      </div>

    </div>
  );
};

export default UserRolesPage;