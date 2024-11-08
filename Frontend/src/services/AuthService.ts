import { GoogleLoginRequest, LoginRequestDto, RefreshTokenRequestDto, RegisterRequestDto, VerifyEmailDto, VerifyTwoFactorDto } from "../model/auth"
import api from "./api"

const register = async (registerData: RegisterRequestDto) => {
    try {
        await api.post("/Auth/register", registerData)
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

const login = async (loginData: LoginRequestDto) => {
    try {
        const response = await api.post('/Auth/login', loginData)
        return response.data
    } catch (error) {
        console.error("Login error:", error)
        throw error
    }
}

const googleLogin = async (googleLoginRequest: GoogleLoginRequest) => {
    try {
        const response = await api.post("Auth/google-login", googleLoginRequest);

        return response.data;
    } catch (error) {
        console.error("Error logging in with Google:", error);
        throw error;
    }
};

const refreshToken = async () => {
    try {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) throw new Error("No refresh token found");

        let tokenData: RefreshTokenRequestDto = {
            refreshToken: storedRefreshToken
        }

        const response = await api.post('/Auth/refreshToken', tokenData);
        return response.data;
    } catch (error) {
        console.error("Refresh token error:", error);
        throw error;
    }
}

const verifyEmail = async (verifyEmailDto: VerifyEmailDto) => {
    try {
        await api.post("/Auth/verify-email", verifyEmailDto)
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

const verifyTwoFactor = async (verifyTwoFactorDto: VerifyTwoFactorDto) => {
    try {
        const response = await api.post("/Auth/verify-two-factor", verifyTwoFactorDto)
        return response.data
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

const getMe = async () => {
    try {
        const response = await api.get('/Auth/getMe');
        return response.data
    } catch (error) {
        console.error("Error in retrieving user:", error)
        throw error
    }
};

export { register, login, googleLogin, refreshToken, verifyEmail, verifyTwoFactor, getMe };