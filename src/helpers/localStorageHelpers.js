import { LS_ACCESS_TOKEN, LS_AUTH_USER, LS_REFRESH_TOKEN } from "constants/localStorageKeys";

export function __ls_set_access_token(token) {
    localStorage.setItem(LS_ACCESS_TOKEN, token);
}
export function __ls_get_access_token() {
    return localStorage.getItem(LS_ACCESS_TOKEN);
}

export function __ls_set_refresh_token(token) {
    localStorage.setItem(LS_REFRESH_TOKEN, token);
}
export function __ls_get_refresh_token() {
    return localStorage.getItem(LS_REFRESH_TOKEN);
}

export function __ls_set_auth_user(data) {
    localStorage.setItem(LS_AUTH_USER, JSON.stringify(data))
}
export function __ls_get_auth_user() {
    return JSON.parse(localStorage.getItem(LS_AUTH_USER))
}

export function __ls_remove_credentials() {
    localStorage.removeItem(LS_ACCESS_TOKEN);
    localStorage.removeItem(LS_REFRESH_TOKEN);
    localStorage.removeItem(LS_AUTH_USER);
}