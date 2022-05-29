import axiosClient from "api/axiosClient";
import axiosFormClient from "api/axiosFormClient";

const getUsers = (params) => {
    return axiosClient.get('/user/', (params && { params: {...params} }));
}
const getUser = ({id}) => {
    return axiosClient.get(`/user/${id}/`);
}

const adminEditUser = ({id, data}) => {
    return axiosClient.patch(`/user/${id}/`, data);
}
const adminDeleteUser = ({id}) => {
    return axiosClient.delete(`/user/${id}/`);
}
const adminGenUserFromCSV = ({formData}) => {
    return axiosFormClient.post(`/user/generate/csv/`, formData)
}

const userAPI = {
    getUsers,
    getUser,
    adminGenUserFromCSV,
    adminEditUser,
    adminDeleteUser,
}

export default userAPI;