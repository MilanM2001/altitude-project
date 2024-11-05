import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import { AppRoute } from '../routes/RoutesEnum';
import { useLogout } from '../hooks/AuthHooks';
import { useAuth } from '../services/AuthContext';
import { IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const { logoutHandler } = useLogout();
    const { role, isAuthenticated } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleLogout = async () => {
        await logoutHandler();
        navigate(AppRoute.LOGIN);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Altitude Project</Link>
            </div>
            <div className="navbar-links">
                {!isAuthenticated ? (
                    <>
                        <Link to={AppRoute.LOGIN}>Login</Link>
                        <Link to={AppRoute.REGISTER}>Register</Link>
                    </>
                ) : (
                    <>
                        {role === 'Admin' && (
                            <Link to={AppRoute.HOME}>Admin Only test</Link>
                        )}
                        <IconButton onClick={handleUserMenuOpen} className="avatar-button">
                            <Avatar alt="User Icon" sx={{ width: 30, height: 30 }} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleUserMenuClose}
                        >
                            <MenuItem onClick={() => { navigate(AppRoute.MY_ACCOUNT); handleUserMenuClose(); }}>
                                My Account
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
