import { Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useRegister } from '../hooks/AuthHooks';
import '../css/RegisterPage.css';

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

const RegisterPage = () => {
    const { registerHandler, loading, errorMessage } = useRegister();

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
                                name="surname"
                                label="Surname"
                                value={values.surname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.surname && errors.surname ? errors.surname : ''}
                            />
                            <InputField
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                value={values.dateOfBirth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : ''}
                            // InputLabelProps={{ shrink: true }}
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
