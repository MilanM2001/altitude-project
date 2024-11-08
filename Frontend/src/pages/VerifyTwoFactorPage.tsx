import { Typography, CircularProgress, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useVerifyTwoFactor } from "../hooks/AuthHooks";
import '../css/VerifyTwoFactorPage.css';

const VerifyTwoFactorPage = () => {
    const { email } = useParams<{ email: string }>();
    const { verifyTwoFactorHandler, loading, error } = useVerifyTwoFactor();
    const [code, setCode] = useState("");

    if (!email) {
        return <Typography color="error">Email parameter not found.</Typography>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await verifyTwoFactorHandler({ email, code });
    };

    return (
        <div className="verify-twofactor-container">
            <div className="verify-twofactor-form">
                <Typography className="verify-twofactor-title">Verify Two-Factor Authentication</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Two-Factor Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="verify-twofactor-button"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} className="loading-spinner" /> : "Verify"}
                    </Button>
                </form>
                {error && (
                    <Typography className="error-message">
                        {"Verification failed. Please try again."}
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default VerifyTwoFactorPage;
