import { Navigate, Outlet } from "react-router-dom";
import { AppRoute } from "./RoutesEnum";

const AdminRoutesOutlet: React.FC = () => {
    const { role, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (role !== 'Admin') {
        return <Navigate to={AppRoute.HOME} replace />;
    }

    return <Outlet />;
};

export default AdminRoutesOutlet;