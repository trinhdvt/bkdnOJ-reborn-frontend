import axiosClient from "api/axiosClient";

const fetchProfile = () => {
    return axiosClient.get('/profile/');
}
const changePassword = (data) => {
    return axiosClient.post('/profile/change-password/', data);
}

const ProfileAPI = {
    fetchProfile,
    changePassword,
}

export default ProfileAPI;
