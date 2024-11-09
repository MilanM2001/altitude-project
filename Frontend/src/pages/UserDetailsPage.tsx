import { useParams } from 'react-router-dom';
import placeholderImage from '../assets/profile-placeholder.jpg';
import {
    CircularProgress,
    Typography,
    Button,
    Box,
    Container,
    Grid,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import '../css/UserDetailsPage.css';
import { useDeleteUser, useGetUserByEmail } from '../hooks/UserHooks';

const UserDetailsPage = () => {
    const { email } = useParams<{ email: string }>();

    if (!email) {
        return <Typography color="error">Email parameter not found.</Typography>;
    }

    const { user, loading, error } = useGetUserByEmail(email);
    const { DeleteUserHandler, loading: deleteLoading } = useDeleteUser();

    const [openDialog, setOpenDialog] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        if (user) {
            setIsDeleted(user.isDeleted);
        }
    }, [user]);

    if (loading) {
        return <CircularProgress className="loading-spinner" />;
    }

    if (error) {
        return (
            <h1 color="error" className="error-message">
                Could not find user with email {email}
            </h1>
        );
    }

    if (!user) {
        return <Typography>No user found</Typography>;
    }

    const userImageSrc = user.image
        ? `data:image/jpeg;base64,${user.image}`
        : placeholderImage;

    const handleDeleteConfirmation = async () => {
        await DeleteUserHandler(email);
        setIsDeleted(true);
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container className="account-container">
            <Paper className="account-box" elevation={3}>
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" className="account-title">User Information</Typography>
                </Box>
                {user ? (
                    <Grid container spacing={4} className="account-grid" alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Box className="account-detail-box">
                                <Typography variant="h6" className="account-label"><b>Email:</b> {user.email}</Typography>
                                <Typography variant="h6" className="account-label"><b>Role:</b> {user.role}</Typography>
                                <Typography variant="h6" className="account-label"><b>Is Verified:</b> {`${user.isVerified ? 'Yes' : 'No'}`}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} textAlign="center">
                            <Box className="account-image-box">
                                <img src={userImageSrc} alt="User" className="account-image" />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box className="account-address-box">
                                <Typography variant="h6" className="account-label"><b>Name:</b> {user.name}</Typography>
                                <Typography variant="h6" className="account-label"><b>Surname:</b> {user.surname}</Typography>
                                <Typography variant="h6" className="account-label"><b>Date of Birth:</b> {new Date(user.dateOfBirth).toLocaleDateString()}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No user information available.</Typography>
                )}
                <Box mt={4} textAlign="center" className="button-container">
                    {isDeleted ? (
                        <Typography variant="h6" color="error">User is deleted</Typography>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="error"
                                className="action-button"
                                onClick={handleOpenDialog}
                                disabled={deleteLoading}
                            >
                                Delete user
                            </Button>
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to delete this user? This action cannot be undone.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleDeleteConfirmation} color="error">
                                        Confirm
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default UserDetailsPage;
