import { Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useRegister } from '../hooks/AuthHooks';
import '../css/RegisterPage.css';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required').min(5, 'Email should be at least 5 characters').max(50, 'Email should be less than 50 characters'),
    password: Yup.string().required('Password is required').min(8, 'Password should be at least 8 characters').max(20, 'Password should be less than 20 characters'),
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
});

const RegisterPage = () => {
    const { registerHandler, loading, errorMessage } = useRegister();

    const handleSubmit = async (values: any) => {
        const registerData = {
            email: values.email,
            password: values.password,
            name: values.name,
            surname: values.surname,
            dateOfBirth: values.dateOfBirth
        };

        await registerHandler(registerData);
    };

    return (
        <Container maxWidth="sm" className="register-container">
            <Box className="register-box">
                <Typography variant="h4" className="register-title">Register</Typography>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        name: '',
                        street: '',
                        city: '',
                        zipCode: '',
                        country: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form className="register-form">
                            <InputField
                                name="email"
                                label="Email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email ? errors.email : ''}
                            />
                            <InputField
                                name="password"
                                label="Password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && errors.password ? errors.password : ''}
                            />
                            <InputField
                                name="name"
                                label="Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && errors.name ? errors.name : ''}
                            />
                            <InputField
                                name="street"
                                label="Street"
                                value={values.street}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.street && errors.street ? errors.street : ''}
                            />
                            <InputField
                                name="city"
                                label="City"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.city && errors.city ? errors.city : ''}
                            />
                            <InputField
                                name="zipCode"
                                label="Zip Code"
                                value={values.zipCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.zipCode && errors.zipCode ? errors.zipCode : ''}
                            />
                            <InputField
                                name="country"
                                label="Country"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.country && errors.country ? errors.country : ''}
                            />
                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="register-button"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                            </Button>
                        </Form>


                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default RegisterPage;
