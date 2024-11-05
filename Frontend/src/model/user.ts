export type UpdateMyInfoDto = {
    name: string
    surname: string
    dateOfBirth: Date
}

export type ChangePasswordDto = {
    currentPassword: string
    newPassword: string
}