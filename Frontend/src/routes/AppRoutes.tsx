import { Route, Routes } from "react-router-dom";
import { AppRoute } from "./RoutesEnum";

const AppRoutes = () => {
    return (
        <Routes>

            /* Routes both authenticated and non authenticated users can access */
            <Route path={AppRoute.HOME} element={<HomePage />} />

            /* Routes which authenticated users cannot access */
            <Route element={<NoAuthRoutesOutlet />}>
                <Route path={AppRoute.LOGIN} element={<LoginPage />} />
                <Route path={AppRoute.REGISTER} element={<RegisterPage />} />
            </Route>

            /* Routes all authenticated users can access */
            <Route element={<AuthRoutesOutlet />}>
                <Route path={AppRoute.MY_ACCOUNT} element={<MyAccountPage />} />
                <Route path={AppRoute.CART} element={<CartPage />} />
            </Route>

            /* Routes only users with role "admin" can access */
            <Route element={<AdminRoutesOutlet />}>
                <Route path={AppRoute.CREATE_PRODUCT} element={<ProductCreatePage />} />
                <Route path={AppRoute.UPDATE_PRODUCT} element={<ProductUpdatePage />} />
            </Route>

            <Route path={AppRoute.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;