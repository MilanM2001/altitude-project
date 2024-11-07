import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';
import placeholderImage from '../assets/profile-placeholder.jpg';
import { useGetAllUsersPageable } from '../hooks/UserHooks';
import { CircularProgress, Typography, Box, Grid, Button, TextField, Card, CardContent } from '@mui/material';
import { useState, useEffect } from 'react';

const HomePage = () => {
    const {
        users,
        loading,
        error,
        totalRecords,
        pageNumber,
        setPageNumber,
        pageSize,
        email,
        setEmail,
        dateOfBirth,
        setDateOfBirth
    } = useGetAllUsersPageable();
    const navigate = useNavigate();
    const totalPages = Math.ceil(totalRecords / pageSize);

    const [debouncedEmail, setDebouncedEmail] = useState(email);
    const [debouncedDateOfBirth, setDebouncedDateOfBirth] = useState(dateOfBirth);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

    useEffect(() => {
        if (debouncedEmail !== email || debouncedDateOfBirth !== dateOfBirth) {
            setPageNumber(1);
        }
    }, [debouncedEmail, debouncedDateOfBirth]);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEmail(value);

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(
            setTimeout(() => {
                setDebouncedEmail(value);
            }, 1500)
        );
    };

    const handleDateOfBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setDateOfBirth(value);

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(
            setTimeout(() => {
                setDebouncedDateOfBirth(value);
            }, 1500) 
        );
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error fetching users</Typography>;
    }

    const handleUserClick = (email: string) => {
        navigate(`/user/${email}`);
    };

    const handlePageChange = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };

    return (
        <div className="main">
            <Box textAlign="center" marginBottom={4}>
                <Typography className="title" variant="h4" gutterBottom>
                    Users List
                </Typography>

                <Box display="flex" justifyContent="center" gap={2} mb={2}>
                    <TextField
                        variant="outlined"
                        placeholder="Search by email"
                        value={email}
                        onChange={handleEmailChange}
                        style={{ width: '250px' }}
                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        placeholder="Search by Date of Birth"
                        value={dateOfBirth}
                        onChange={handleDateOfBirthChange}
                        style={{ width: '250px' }}
                    />
                </Box>

                <Grid container spacing={4} style={{ padding: '16px' }}>
                    {users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.email}>
                            <Card className="user-card">
                                <Box className="account-image-box">
                                    <img
                                        onClick={() => handleUserClick(user.email)}
                                        src={user.image ? URL.createObjectURL(user.image) : placeholderImage}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        onClick={() => handleUserClick(user.email)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {user.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(user.dateOfBirth).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box marginTop={4} display="flex" justifyContent="center">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index + 1}
                            variant={index + 1 === pageNumber ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => handlePageChange(index + 1)}
                            style={{ margin: '0 5px' }}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </Box>
            </Box>
        </div>
    );
};

export default HomePage;
