import { Button, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import { useChangePassword } from '../hooks/UserHooks';
import '../css/ChangePasswordPage.css';

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password should be at least 8 characters')
        .matches(/[A-Z]/, 'Password should contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password should contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password should contain at least one number')
});

const ChangePasswordPage = () => {
    const { ChangePasswordHandler, loading, errorMessage } = useChangePassword();

    const handleSubmit = async (values: any) => {
        const changePasswordDto = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        };

        await ChangePasswordHandler(changePasswordDto);
    };

    return (
        <Container maxWidth="sm" className="password-change-container">
            <Box className="password-change-box">
                <Typography variant="h4" className="password-change-title">Change Password</Typography>
                <Formik
                    initialValues={{ currentPassword: '', newPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form className="password-change-form">
                            <InputField
                                name="currentPassword"
                                label="Current Password"
                                type="password"
                                value={values.currentPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : ''}
                            />
                            <InputField
                                name="newPassword"
                                label="New Password"
                                type="password"
                                value={values.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.newPassword && errors.newPassword ? errors.newPassword : ''}
                            />
                            {errorMessage && <Typography className='error-message' color="error">{errorMessage}</Typography>}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="password-change-button"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default ChangePasswordPage;
