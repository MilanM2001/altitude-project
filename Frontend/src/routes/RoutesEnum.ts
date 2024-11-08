export enum AppRoute {
    HOME = '/',
    LOGIN = '/login',
    REGISTER = '/register',
    MY_ACCOUNT = '/my-account',
    UPDATE_INFO = '/update-info',
    CHANGE_PASSWORD = '/change-password',
    USER_DETAILS = '/user/:email',
    VERIFY_EMAIL = '/verify-account/:email',
    VERIFY_TWO_FACTOR = '/verify-two-factor/:email',
    NOT_FOUND = "*"
}