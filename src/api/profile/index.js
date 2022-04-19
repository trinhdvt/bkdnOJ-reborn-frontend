import axiosClient from "api/axiosClient";
import axios from "axios";
import { __ls_get_access_token } from "helpers/localStorageHelpers";

const fetchProfile = () => {
    return axiosClient.get('/profile/');
}
export default {
    fetchProfile,
}