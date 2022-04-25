import axiosClient from "api/axiosClient";

const signIn = (data) => {
    return axiosClient.post('/sign-in/', JSON.stringify(data));
}

const signOut = () => {
    return axiosClient.get('/sign-out/');
}

const signUp = (data) => {
    return axiosClient.post('/sign-up/', JSON.stringify(data));
}

const AuthAPI = {
    signIn, signOut, signUp
};

export default AuthAPI;