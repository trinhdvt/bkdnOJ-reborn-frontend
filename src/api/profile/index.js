import axiosClient from "api/axiosClient";

const fetchProfile = () => {
    return axiosClient.get('/profile/');
}

const ProfileAPI = {
    fetchProfile,
}

export default ProfileAPI;