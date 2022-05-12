import axiosClient from "api/axiosClient";

const getProblems = (params) => {
    return axiosClient.get('/problem/', (params && { params: {...params} }));
}
const getProblemDetails = ({name}) => {
    return axiosClient.get(`/problem/${name}`);
}
const submitToProblem = ({name, data}) => {
    return axiosClient.post(`/problem/${name}`, JSON.stringify(data));
}

const problemAPI = {
    getProblems,
    getProblemDetails,
    submitToProblem,
}

export default problemAPI;