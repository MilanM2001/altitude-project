import { ChangePasswordDto, UpdateMyInfoDto } from "../model/user"
import api from "./api"

const updateMyInfo = async (updateMyInfoDto: UpdateMyInfoDto) => {
    try {
        await api.put("/User/updateMyInfo", updateMyInfoDto)
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

const changePassword = async (changePasswordDto: ChangePasswordDto) => {
    try {
        await api.put("/User/changePassword", changePasswordDto)
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

export { updateMyInfo, changePassword }