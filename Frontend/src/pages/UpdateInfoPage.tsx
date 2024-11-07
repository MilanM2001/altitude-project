import { Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useEffect, useState } from 'react';
import '../css/UpdateInfoPage.css';
import { useGetMe } from '../hooks/AuthHooks';
import { useUpdateMyInfo } from '../hooks/UserHooks';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name should be at least 2 characters').max(30, 'Name should be less than 30 characters'),
    surname: Yup.string().required('Surname is required').min(2, 'Surname should be at least 2 characters').max(30, 'Surname should be less than 30 characters'),
    dateOfBirth: Yup.date().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future'),
});

const UpdateInfoPage = () => {
    const { getMeHandler } = useGetMe();
    const { updatemyInfoHandler, loading, errorMessage } = useUpdateMyInfo();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await getMeHandler();
            setUserData(res);
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (values: any) => {
        const userInfoUpdate = {
            name: values.name,
            surname: values.surname,
            dateOfBirth: values.dateOfBirth,
        };

        await updatemyInfoHandler(userInfoUpdate);
    };

    if (!userData) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm" className="info-update-container">
            <Box className="info-update-box">
                <Typography variant="h4" className="info-update-title">Update My Information</Typography>
                <Formik
                    initialValues={{
                        name: userData.name || '',
                        surname: userData.surname || '',
                        dateOfBirth: userData.dateOfBirth || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form className="info-update-form">
                            <InputField
                                name="name"
                                label="Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && typeof errors.name === 'string' ? errors.name : ''}
                            />
                            <InputField
                                name="surname"
                                label="Surname"
                                value={values.surname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.surname && typeof errors.surname === 'string' ? errors.surname : ''}
                            />
                            <InputField
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                // InputLabelProps={{ shrink: true }}
                                value={values.dateOfBirth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.dateOfBirth && typeof errors.dateOfBirth === 'string' ? errors.dateOfBirth : ''}
                            />
                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="info-update-button"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Information'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default UpdateInfoPage;
