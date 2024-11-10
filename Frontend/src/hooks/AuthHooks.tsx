import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLoginRequest, LoginRequestDto, RegisterRequestDto, VerifyEmailDto, VerifyTwoFactorDto } from "../model/auth";
import { getMe, googleLogin, login, register, verifyEmail, verifyTwoFactor } from "../services/AuthService";
import { useAuth } from "../services/AuthContext";
import { AppRoute } from "../routes/RoutesEnum";

const useRegister = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const registerHandler = async (registerData: RegisterRequestDto) => {
        try {
            setIsLoading(true)
            await register(registerData)
            navigate(AppRoute.LOGIN)
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setErrorMessage("Email already taken")
            }
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { registerHandler, loading, error, errorMessage }
}

const useLogin = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { login: loginContext } = useAuth();
    const navigate = useNavigate();

    const loginHandler = async (loginData: LoginRequestDto) => {
        try {
            setIsLoading(true);
            const data = await login(loginData);
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;
            await loginContext(accessToken, refreshToken);
            navigate(AppRoute.MY_ACCOUNT);
        } catch (error: any) {
            if (error.response && (error.response.status === 404)) {
                setErrorMessage('Username or Password incorrect');
            } else if (error.response.status === 409) {
                setErrorMessage('User deleted')
            } else if (error.response.status === 403) {
                setErrorMessage("Email not verified")
            } else if (error.response.status === 405) {
                setErrorMessage("Two factor enabled. A code has been sent to your email")
            } else if (error.response.status === 408) {
                setErrorMessage("Two factor code has already been sent to your email")
            } else if (error.response.status === 498) {
                setErrorMessage("Two factor code expired. A new one has been sent to your email")
            }
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { loginHandler, loading, error, errorMessage };
};

const useGoogleLogin = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { login: loginContext } = useAuth();
    const navigate = useNavigate();

    const googleLoginHandler = async (googleLoginRequest: GoogleLoginRequest) => {
        try {
            setIsLoading(true);
            const data = await googleLogin(googleLoginRequest);
            //If the user exists then log him in
            if (data.accessToken != "") {
                const accessToken = data.accessToken;
                const refreshToken = data.refreshToken;
                await loginContext(accessToken, refreshToken);
                navigate(AppRoute.MY_ACCOUNT);
                //If he does not then return the object of the new user 
            } else if (data.accessToken == "") {
                return data.newUser
            }

        } catch (error: any) {
            if (error.response.status === 409) {
                setErrorMessage('User deleted')
            } else if (error.response.status === 403) {
                setErrorMessage("Email not verified")
            } else if (error.response.status === 405) {
                setErrorMessage("Two factor enabled. A code has been sent to your email")
            } else if (error.response.status === 408) {
                setErrorMessage("Two factor code has already been sent to your email")
            } else if (error.response.status === 498) {
                setErrorMessage("Two factor code expired. A new one has been sent to your email")
            }
            setError(error)
        } finally {
            setIsLoading(false);
        }
    };

    return { googleLoginHandler, loading, error, errorMessage };
};

const useLogout = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout: logoutContext } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            setIsLoading(true);
            logoutContext();
            navigate("/login");
        } catch (error: any) {
            setError(error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { logoutHandler, loading, error };
};

const useVerifyEmail = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const verifyEmailHandler = async (verifyEmailDto: VerifyEmailDto) => {
        try {
            setIsLoading(true)
            await verifyEmail(verifyEmailDto)
            navigate(AppRoute.LOGIN)
        } catch (error: any) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { verifyEmailHandler, loading, error }
}

const useVerifyTwoFactor = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate()
    const { login: loginContext } = useAuth();

    const verifyTwoFactorHandler = async (verifyTwoFactorDto: VerifyTwoFactorDto) => {
        try {
            setIsLoading(true)
            const data = await verifyTwoFactor(verifyTwoFactorDto)
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;
            await loginContext(accessToken, refreshToken);
            navigate(AppRoute.MY_ACCOUNT);
        } catch (error: any) {
            if (error.response.status === 409) {
                setErrorMessage("Invalid Code")
            } else if (error.response.status === 498) {
                setErrorMessage("Two factor code expired. A new one has been sent to your email")
            }
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { verifyTwoFactorHandler, loading, error, errorMessage }
}

const useGetMe = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const getMeHandler = async () => {
        try {
            setIsLoading(true)
            const res = await getMe()
            return res
        } catch (error: any) {
            setError(error)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    return { getMeHandler, loading, error }
}

export { useRegister, useLogin, useGoogleLogin, useLogout, useVerifyEmail, useVerifyTwoFactor, useGetMe }