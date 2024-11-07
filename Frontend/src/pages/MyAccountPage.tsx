import { Box, Typography, Container, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useEffect, useState } from 'react';
import '../css/MyAccountPage.css';
import placeholderImage from '../assets/profile-placeholder.jpg';
import { useGetMe } from '../hooks/AuthHooks';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../routes/RoutesEnum';
import { useChangeProfilePicture } from '../hooks/UserHooks';

const MyAccountPage = () => {
    const { getMeHandler } = useGetMe();
    const { ChangeProfilePictureHandler } = useChangeProfilePicture();
    const [userData, setUserData] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await getMeHandler();
            setUserData(res);
        };
        fetchUserData();
    }, []);

    const userImageSrc = userData?.image
        ? `data:image/jpeg;base64,${userData.image}`
        : placeholderImage;

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const formData = new FormData();
            formData.append("ImageFile", event.target.files[0]);

            await ChangeProfilePictureHandler(formData);
            const res = await getMeHandler();
            setUserData(res);
        }
        handleDialogClose();
    };

    return (
        <Container className="account-container">
            <Paper className="account-box" elevation={3}>
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" className="account-title">My Information</Typography>
                </Box>
                {userData ? (
                    <Grid container spacing={4} className="account-grid" alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Box className="account-detail-box">
                                <Typography variant="h6" className="account-label"><b>Email:</b> {userData.email}</Typography>
                                <Typography variant="h6" className="account-label"><b>Role:</b> {userData.role}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} textAlign="center">
                            <Box className="account-image-box">
                                <img src={userImageSrc} alt="User" className="account-image" />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                        color="primary"
                        onClick={handleDialogOpen}
                        className="change-picture-button"
                    >
                        Change Profile Picture
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


            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Select a Profile Picture</DialogTitle>
                <DialogContent>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyAccountPage;
