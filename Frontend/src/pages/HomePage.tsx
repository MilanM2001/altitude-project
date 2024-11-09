import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box, Grid, Button, TextField, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useGetAllUsersPageable } from '../hooks/UserHooks';
import placeholderImage from '../assets/profile-placeholder.jpg';
import '../css/HomePage.css'

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
        setDateOfBirth,
        isVerified,
        setIsVerified,
    } = useGetAllUsersPageable();

    const navigate = useNavigate();
    const totalPages = Math.ceil(totalRecords / pageSize);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleDateOfBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateOfBirth(event.target.value);
    };

    const handleIsVerifiedChange = (event: SelectChangeEvent<boolean | "all">) => {
        const selectedValue = event.target.value;
        setIsVerified(selectedValue === 'all' ? null : selectedValue === 'true');
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
                    <FormControl variant="outlined" style={{ width: '250px' }}>
                        <InputLabel>Verification Status</InputLabel>
                        <Select
                            value={isVerified ?? 'all'}
                            onChange={handleIsVerifiedChange}
                            label="Verification Status"
                        >
                            <MenuItem value="true">Verified</MenuItem>
                            <MenuItem value="false">Unverified</MenuItem>
                            <MenuItem value="all">All</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={4} style={{ padding: '16px' }}>
                    {users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.email}>
                            <Card className="user-card">
                                <Box className="account-image-box">
                                    <img
                                        className='card-image'
                                        onClick={() => handleUserClick(user.email)}
                                        src={user.image ? `data:image/jpeg;base64,${user.image}` : placeholderImage}
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
                                    <Typography variant="body2" color="text.secondary">
                                        {`Is Verified: ${user.isVerified ? 'Yes' : 'No'}`}
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
