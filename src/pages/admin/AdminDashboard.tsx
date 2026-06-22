import { ADMIN_TABLES } from "./adminConfig";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-light mb-2">Welcome back</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Select a section from the sidebar to manage content.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ADMIN_TABLES.map((t) => (
          <Link
            key={t.key}
            to={`/admin/${t.key}`}
            className="border border-border p-4 hover:bg-muted transition-colors"
          >
            <p className="text-sm font-medium">{t.label}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{t.table}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
