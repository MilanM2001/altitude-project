import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChangePasswordDto, UpdateMyInfoDto } from "../model/user"
import { changePassword, updateMyInfo } from "../services/UserService"
import { AppRoute } from "../routes/RoutesEnum"

const useUpdateMyInfo = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const updatemyInfoHandler = async (updateMyInfoDto: UpdateMyInfoDto) => {
        try {
            setIsLoading(true)
            await updateMyInfo(updateMyInfoDto)
            navigate(AppRoute.MY_ACCOUNT)
        } catch (error: any) {
            if (error.response) {
                setErrorMessage("Error updating my info")
            }
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { updatemyInfoHandler, loading, error, errorMessage }
}

const useChangePassword = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const ChangePasswordHandler = async (changePasswordDto: ChangePasswordDto) => {
        try {
            setIsLoading(true)
            await changePassword(changePasswordDto)
            navigate(AppRoute.MY_ACCOUNT)
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setErrorMessage("Current password incorrect");
            } else if (error.response) {
                setErrorMessage("Error changing password");
            } else {
                setErrorMessage("An unexpected error occurred");
            }
            setError(error);
        } finally {
            setIsLoading(false)
        }
    }

    return { ChangePasswordHandler, loading, error, errorMessage }
}

export { useUpdateMyInfo, useChangePassword }