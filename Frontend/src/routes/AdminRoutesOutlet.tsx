import { Navigate, Outlet } from "react-router-dom";
import { AppRoute } from "./RoutesEnum";
import { useAuth } from "../services/AuthContext";

const AdminRoutesOutlet: React.FC = () => {
    const { role, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (role !== 'Admin') {
        return <Navigate to={AppRoute.MY_ACCOUNT} replace />;
    }

    return <Outlet />;
};

export default AdminRoutesOutlet;