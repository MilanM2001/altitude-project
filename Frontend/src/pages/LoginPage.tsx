import { Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useLogin } from '../hooks/AuthHooks';
import '../css/LoginPage.css';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required')
        .min(5, 'Email should be at least 5 characters')
        .max(50, 'Email should be less than 50 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(3, 'Password should be at least 3 characters')
        .max(20, 'Password should be less than 20 characters'),
});

const LoginPage = () => {
    const { loginHandler, loading, errorMessage } = useLogin();


    const handleSubmit = async (values: any) => {
        const loginData = {
            email: values.email,
            password: values.password,
        };

        await loginHandler(loginData);
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
                    validationSchema={validationSchema}
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

                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default LoginPage;
