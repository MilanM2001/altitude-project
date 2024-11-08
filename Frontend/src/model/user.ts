export type UpdateMyInfoDto = {
    name: string
    surname: string
    dateOfBirth: Date
}

export type UserResponseDto = {
    email: string
    name: string
    surname: string
    role: string
    dateOfBirth: Date
    isDeleted: boolean
    isVerified: boolean
    TwoFactorEnabled: boolean
    image: File | null
}

export type ChangeProfilePictureDto = {
    image: File | null
}

export type ChangePasswordDto = {
    currentPassword: string
    newPassword: string
}