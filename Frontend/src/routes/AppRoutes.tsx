import { Route, Routes } from "react-router-dom";
import { AppRoute } from "./RoutesEnum";
import NoAuthRoutesOutlet from "./NoAuthRoutesOutlet";
import AuthRoutesOutlet from "./AuthRoutesOutlet";
import AdminRoutesOutlet from "./AdminRoutesOutlet";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MyAccountPage from "../pages/MyAccountPage";
import UpdateInfoPage from "../pages/UpdateInfoPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import UserDetailsPage from "../pages/UserDetailsPage";

const AppRoutes = () => {
    return (
        <Routes>

            /* Routes which authenticated users cannot access */
            <Route element={<NoAuthRoutesOutlet />}>
                <Route path={AppRoute.LOGIN} element={<LoginPage />} />
                <Route path={AppRoute.REGISTER} element={<RegisterPage />} />
            </Route>

            /* Routes all authenticated users can access */
            <Route element={<AuthRoutesOutlet />}>
                <Route path={AppRoute.MY_ACCOUNT} element={<MyAccountPage />} />
                <Route path={AppRoute.UPDATE_INFO} element={<UpdateInfoPage />} />
                <Route path={AppRoute.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
            </Route>

            /* Routes only users with role "Admin" can access */
            <Route element={<AdminRoutesOutlet />}>
                <Route path={AppRoute.HOME} element={<HomePage />} />
                <Route path={AppRoute.USER_DETAILS} element={<UserDetailsPage />} />
            </Route>

            <Route path={AppRoute.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;