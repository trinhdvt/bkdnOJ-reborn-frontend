import axiosClient from "api/axiosClient";

const getProblems = (params) => {
    return axiosClient.get('/problem/', (params && { params: {...params} }));
}
const getProblemDetails = ({shortname}) => {
    return axiosClient.get(`/problem/${shortname}`);
}
const submitToProblem = ({name, data}) => {
    return axiosClient.post(`/problem/${name}/submit/`, JSON.stringify(data));
}

const problemAPI = {
    getProblems,
    getProblemDetails,
    submitToProblem,
}

export default problemAPI;