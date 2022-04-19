import axiosClient from "api/axiosClient";
import axios from "axios";

const signIn = (data) => {
    return axiosClient.post('/sign-in/', JSON.stringify(data));
}

const signOut = (data) => {
    return axiosClient.get('/sign-out/');
}

const signUp = (data) => {
    return axiosClient.post('/sign-up/', JSON.stringify(data));
}

export default {
    signIn, signOut, signUp
}