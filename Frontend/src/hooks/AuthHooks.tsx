import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginRequestDto, RegisterRequestDto } from "../model/auth";
import { getMe, login, register } from "../services/AuthService";
import { useAuth } from "../services/AuthContext";

const useRegister = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const registerHandler = async (registerData: RegisterRequestDto) => {
        try {
            setIsLoading(true)
            await register(registerData)
            navigate("/login")
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setErrorMessage("Username taken")
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
            navigate("/");
        } catch (error: any) {
            if (error.response && (error.response.status === 403 || error.response.status === 401 || error.response.status === 404)) {
                setErrorMessage('Username or Password incorrect');
            }
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { loginHandler, loading, error, errorMessage };
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

export { useRegister, useLogin, useLogout, useGetMe }