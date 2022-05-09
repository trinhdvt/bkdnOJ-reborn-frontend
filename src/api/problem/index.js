import axiosClient from "api/axiosClient";

const getProblems = () => {
    return axiosClient.get('/problem/');
}

const ProfileAPI = {
    fetchProfile,
}

export default ProfileAPI;