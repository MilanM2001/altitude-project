import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import '../css/MyAccountPage.css';
import { useGetMe } from '../hooks/AuthHooks';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../routes/RoutesEnum';

const MyAccountPage = () => {
    const { getMeHandler } = useGetMe();
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await getMeHandler();
            setUserData(res);
        };
        fetchUserData();
    }, []);

    return (
        <Container className="account-container">
            <Paper className="account-box" elevation={3}>
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" className="account-title">My Information</Typography>
                </Box>
                {userData ? (
                    <Grid container spacing={4} className="account-grid">
                        <Grid item xs={12} sm={6}>
                            <Box className="account-detail-box">
                                <Typography variant="h6" className="account-label"><b>Email:</b> {userData.email}</Typography>
                                <Typography variant="h6" className="account-label"><b>Role:</b> {userData.role}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className="account-address-box">
                                <Typography variant="h6" className="account-label"><b>Name:</b> {userData.name}</Typography>
                                <Typography variant="h6" className="account-label"><b>Surname:</b> {userData.surname}</Typography>
                                <Typography variant="h6" className="account-label"><b>Date of Birth:</b> {userData.dateOfBirth}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No user information available.</Typography>
                )}
                <Box mt={4} textAlign="center" className="button-container">
                    <Button
                        variant="contained"
                        color="primary"
                        className="action-button"
                        onClick={() => navigate(AppRoute.UPDATE_INFO)}
                    >
                        Update Info
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className="action-button"
                        onClick={() => navigate(AppRoute.CHANGE_PASSWORD)}
                    >
                        Change Password
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default MyAccountPage;
