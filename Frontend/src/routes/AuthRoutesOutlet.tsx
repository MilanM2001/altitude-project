import { Navigate, Outlet } from "react-router-dom";
import { AppRoute } from "./RoutesEnum";
import { useAuth } from "../services/AuthContext";

const AuthRoutesOutlet: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to={AppRoute.LOGIN} replace />;
    }

    return <Outlet />;
};

export default AuthRoutesOutlet;