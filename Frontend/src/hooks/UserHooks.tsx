import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChangePasswordDto, UpdateMyInfoDto, UserResponseDto } from "../model/user"
import { changePassword, changeProfilePicture, deleteUser, getAllUsersPageable, getUserByEmail, updateMyInfo } from "../services/UserService"
import { AppRoute } from "../routes/RoutesEnum"

const useGetAllUsersPageable = () => {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const pageSize = 6;

    useEffect(() => {
        const getAllUsersPageableHandler = async () => {
            try {
                setIsLoading(true);
                const res = await getAllUsersPageable(pageNumber, pageSize, email, dateOfBirth);
                setUsers(res.users);
                setTotalRecords(res.totalRecords);
            } catch (error: any) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        getAllUsersPageableHandler();
    }, [pageNumber, email, dateOfBirth]);

    return {
        users,
        totalRecords,
        loading,
        error,
        pageNumber,
        setPageNumber,
        pageSize,
        email,
        setEmail,
        dateOfBirth,
        setDateOfBirth,
    };
};

const useGetUserByEmail = (email: string) => {
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserByEmailHandler = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getUserByEmail(email)
                setUser(response);
            } catch (error: any) {
                setError(error);
                if (error.response.status === 404) {
                    setError(error)
                }
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            getUserByEmailHandler();
        }
    }, [email]);

    return { user, loading, error };
};

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

const useChangeProfilePicture = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const ChangeProfilePictureHandler = async (pictureRequest: FormData) => {
        try {
            setIsLoading(true)
            await changeProfilePicture(pictureRequest)
            navigate(AppRoute.MY_ACCOUNT)
        } catch (error: any) {
            if (error.response) {
                setErrorMessage("Error changing profile picture");
            }
            setError(error);
        } finally {
            setIsLoading(false)
        }
    }

    return { ChangeProfilePictureHandler, loading, error, errorMessage }
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

const useDeleteUser = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    // const navigate = useNavigate()

    const DeleteUserHandler = async (email: string) => {
        try {
            setIsLoading(true)
            await deleteUser(email)
            // navigate(AppRoute.MY_ACCOUNT)
        } catch (error: any) {
            if (error) {
                setErrorMessage("Error deleting user");
            }

            setError(error);
        } finally {
            setIsLoading(false)
        }
    }

    return { DeleteUserHandler, loading, error, errorMessage }
}

export { useGetAllUsersPageable, useGetUserByEmail, useUpdateMyInfo, useChangeProfilePicture, useChangePassword, useDeleteUser }