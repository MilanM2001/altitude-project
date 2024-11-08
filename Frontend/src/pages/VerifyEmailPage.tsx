import { Typography, CircularProgress, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyEmail } from "../hooks/AuthHooks";
import { useGetUserByEmail } from "../hooks/UserHooks";
import { AppRoute } from "../routes/RoutesEnum";
import '../css/VerifyEmailPage.css';

const VerifyEmailPage = () => {
    const { email } = useParams<{ email: string }>();
    const { user, loading: userLoading, error: userError } = useGetUserByEmail(email ?? "");
    const { verifyEmailHandler, loading: verifyLoading, error: verifyError } = useVerifyEmail();
    const navigate = useNavigate();
    const [code, setCode] = useState("");

    if (!email) {
        return <Typography color="error">Email parameter not found.</Typography>;
    }

    if (userLoading) {
        return <CircularProgress className="loading-spinner" />;
    }

    if (userError) {
        return (
            <Typography color="error" className="error-message">
                Could not find user with email {email}
            </Typography>
        );
    }

    if (user?.isVerified) {
        navigate(AppRoute.LOGIN);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await verifyEmailHandler({ email, code });
    };

    return (
        <div className="verify-email-container">
            <div className="verify-email-form">
                <Typography className="verify-email-title">Verify Your Email</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="verify-email-button"
                        disabled={verifyLoading}
                    >
                        {verifyLoading ? <CircularProgress size={24} className="loading-spinner" /> : "Verify Email"}
                    </Button>
                </form>
                {verifyError && (
                    <Typography className="error-message">
                        {"Verification failed. Please try again."}
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;