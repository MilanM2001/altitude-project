export type LoginRequestDto = {
    email: string
    password: string
}

export type GoogleLoginRequest = {
    token: string
}

export type VerifyEmailDto = {
    email: string
    code: string
}

export type VerifyTwoFactorDto = {
    email: string
    code: string
}

export type GoogleRegisterRequest = {
    token: string
    password: string
    dateOfBirth: Date
}

export type RegisterRequestDto = {
    email: string
    password: string
    name: string
    surname: string
    dateOfBirth: Date
}

export type RefreshTokenRequestDto = {
    refreshToken: string
}