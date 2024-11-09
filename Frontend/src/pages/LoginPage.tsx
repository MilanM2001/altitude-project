import { Button, Typography, Box, Container, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useLogin, useGoogleLogin, useRegister } from '../hooks/AuthHooks';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { GoogleLoginRequest } from '../model/auth';
import { useState } from 'react';
import { UserResponseDto } from '../model/user';
import '../css/LoginPage.css';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required')
        .min(5, 'Email should be at least 5 characters')
        .max(50, 'Email should be less than 50 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password should be at least 8 characters')
        .max(20, 'Password should be less than 20 characters'),
});

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

const LoginPage = () => {
    const { loginHandler, loading, errorMessage } = useLogin();
    const { registerHandler } = useRegister();
    const { googleLoginHandler, loading: googleLoading, errorMessage: googleErrorMessage } = useGoogleLogin();

    const [newUser, setNewUser] = useState<UserResponseDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGoogleLogin, setIsGoogleLogin] = useState(false);

    const handleSubmit = async (values: any) => {
        const loginData = {
            email: values.email,
            password: values.password,
        };
        await loginHandler(loginData);
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
                    setIsGoogleLogin(true);
                    setIsModalOpen(true);
                }
            } catch (error) {
                console.error('Google Sign-In failed:', error);
            }
        } else {
            console.error('Google Sign-In failed: No token received.');
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
            setIsModalOpen(false);
            await registerHandler(registrationData);
            setIsGoogleLogin(false)
        }
    };

    const handleGoogleFailure = () => {
        console.error('Google Sign-In was unsuccessful.');
    };

    return (
        <Container maxWidth="sm" className="login-container">
            <Box className="login-box">
                <Typography variant="h4" className="login-title">Login</Typography>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={isGoogleLogin ? modalValidationSchema : validationSchema} // Use modal schema if Google login
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form className="login-form">
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
                            {(errorMessage || googleErrorMessage) && (
                                <Typography className="error-message" color="error" align="center">
                                    {errorMessage || googleErrorMessage}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="login-button"
                                disabled={loading || googleLoading}
                            >
                                {loading || googleLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                            </Button>
                        </Form>
                    )}
                </Formik>
                <div className="google-login">
                    <Typography variant="body1" align="center" marginY={2}>
                        OR
                    </Typography>
                    <GoogleOAuthProvider clientId="158219373742-gfbebtft5b3513a3nue58atin351fidi.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                            theme="outline"
                            shape="circle"
                            isLoading={googleLoading}
                        />
                    </GoogleOAuthProvider>
                </div>
            </Box>

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
                                        Complete Registration
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(false)} color="secondary" variant="outlined">
                                        Cancel
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

export default LoginPage;
