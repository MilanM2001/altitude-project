import { ChangePasswordDto, UpdateMyInfoDto } from "../model/user"
import api from "./api"

const getAllUsersPageable = async (pageNumber = 1, pageSize = 6, email = '', dateOfBirth = '') => {
    try {
        const response = await api.get(`/User/allPageable`, {
            params: {
                pageNumber,
                pageSize,
                email: email || undefined,
                dateOfBirth: dateOfBirth || undefined,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error in finding users:", error);
        throw error;
    }
};


const getUserByEmail = async (email: string) => {
    try {
        const res = await api.get(`/User/${email}`)
        return res.data
    } catch (error) {
        console.error("Error in finding user by email:", error)
        throw error
    }
}

const updateMyInfo = async (updateMyInfoDto: UpdateMyInfoDto) => {
    try {
        await api.put("/User/updateMyInfo", updateMyInfoDto)
    } catch (error) {
        console.error("Update Info error:", error)
        throw error
    }
}

const changeProfilePicture = async (changeProfilePicture: FormData) => {
    try {
        await api.put("/User/changeProfilePicture", changeProfilePicture, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (error) {
        console.error("Change Profile Picture error:", error);
        throw error;
    }
}

const changePassword = async (changePasswordDto: ChangePasswordDto) => {
    try {
        await api.put("/User/changePassword", changePasswordDto)
    } catch (error) {
        console.error("Change Password error:", error)
        throw error
    }
}

const deleteUser = async (email: string) => {
    try {
        await api.put(`/User/deleteUser/${email}`)
    } catch (error) {
        console.error("Change Password error:", error)
        throw error
    }
}

export { getAllUsersPageable, getUserByEmail, updateMyInfo, changeProfilePicture, changePassword, deleteUser }