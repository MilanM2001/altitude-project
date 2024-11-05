import { Typography, TextField, Box } from '@mui/material';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    // if (loading) {
    //     return <CircularProgress />;
    // }

    // if (error) {
    //     return <Typography color="error">Error fetching products</Typography>;
    // }

    return (
        <div className='main'>
            <Box textAlign="center" marginBottom={4}>
                <Typography className='title' variant="h4" gutterBottom>
                    Available products
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search for products..."
                    fullWidth
                    style={{ maxWidth: '400px', margin: '0 auto' }}
                />

            </Box>
        </div>
    );
};

export default HomePage;
