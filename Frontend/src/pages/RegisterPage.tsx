import {
    Button,
    Typography,
    Box,
    Container,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useGoogleLogin, useRegister } from '../hooks/AuthHooks';
import '../css/RegisterPage.css';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { GoogleLoginRequest } from '../model/auth';
import { useState } from 'react';
import { UserResponseDto } from '../model/user';

// Main form validation schema
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required')
        .min(5, 'Email should be at least 5 characters')
        .max(50, 'Email should be less than 50 characters'),
    password: Yup.string()
        .required('New password is required')
        .min(8, 'Password should be at least 8 characters')
        .max(30, 'Password should be less than 30 characters')
        .matches(/[A-Z]/, 'Password should contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password should contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password should contain at least one number'),
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name should be at least 3 characters')
        .max(30, 'Name should be less than 30 characters'),
    surname: Yup.string()
        .required('Surname is required')
        .min(3, 'Surname should be at least 3 characters')
        .max(30, 'Surname should be less than 30 characters'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of Birth cannot be in the future'),
});

// Modal validation schema
const modalValidationSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password should be at least 8 characters')
        .max(30, 'Password should be less than 30 characters')
        .matches(/[A-Z]/, 'Password should contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password should contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password should contain at least one number'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of Birth cannot be in the future'),
});

const RegisterPage = () => {
    const { registerHandler, loading, errorMessage } = useRegister();
    const { googleLoginHandler } = useGoogleLogin();

    const [newUser, setNewUser] = useState<UserResponseDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (values: any) => {
        const registerData = {
            email: values.email,
            password: values.password,
            name: values.name,
            surname: values.surname,
            dateOfBirth: values.dateOfBirth,
        };
        await registerHandler(registerData);
    };

    const handleGoogleSuccess = async (response: CredentialResponse) => {
        const googleToken = response.credential;

        if (googleToken) {
            const googleLoginRequest: GoogleLoginRequest = {
                token: googleToken,
            };

            try {
                const userData = await googleLoginHandler(googleLoginRequest);
                if (userData) {
                    setNewUser(userData);
                    setIsModalOpen(true); // Show modal if user data is returned
                }
            } catch (error) {
                console.error("Google Sign-In failed:", error);
            }
        } else {
            console.error("Google Sign-In failed: No token received.");
        }
    };

    const handleCompleteRegistration = async (values: any) => {
        if (newUser) {
            const registrationData = {
                email: newUser.email,
                name: newUser.name,
                surname: newUser.surname,
                password: values.password,
                dateOfBirth: values.dateOfBirth,
            };
            setIsModalOpen(false); // Close modal after completing registration
            await registerHandler(registrationData);
        }
    };

    const handleGoogleFailure = () => {
        console.error("Google Sign-In was unsuccessful.");
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
                        surname: '',
                        dateOfBirth: '',
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
                                error={touched.email && errors.email ? errors.email : ''} />
                            <InputField
                                name="password"
                                label="Password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && errors.password ? errors.password : ''} />
                            <InputField
                                name="name"
                                label="Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && errors.name ? errors.name : ''} />
                            <InputField
                                name="surname"
                                label="Surname"
                                value={values.surname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.surname && errors.surname ? errors.surname : ''} />
                            <InputField
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                value={values.dateOfBirth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : ''} />
                            {errorMessage && <Typography className='error-message' color="error">{errorMessage}</Typography>}
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

                <div className='google-login'>
                    <Typography variant="body1" align="center" marginY={2}>
                        OR
                    </Typography>
                    <GoogleOAuthProvider clientId="158219373742-gfbebtft5b3513a3nue58atin351fidi.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />
                    </GoogleOAuthProvider>
                </div>
            </Box>

            {/* Modal for Google Sign-In users */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DialogTitle>Complete Registration</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            password: '',
                            dateOfBirth: '',
                        }}
                        validationSchema={modalValidationSchema}
                        onSubmit={handleCompleteRegistration}
                    >
                        {({ errors, touched, handleChange, handleBlur, values }) => (
                            <Form>
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
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    type="date"
                                    value={values.dateOfBirth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : ''}
                                />
                                <DialogActions>
                                    <Button type="submit" color="primary" variant="contained">
                                        Register
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(false)} color="secondary" variant="outlined">
                                        Cancel Registration
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default RegisterPage;
