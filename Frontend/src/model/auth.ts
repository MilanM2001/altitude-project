export type LoginRequestDto = {
    email: string
    password: string
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