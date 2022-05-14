import axiosClient from "api/axiosClient";

const getSubmissions = (params) => {
    return axiosClient.get('/submission/', (params && { params: {...params} }));
}
const getSubmissionDetails = ({id}) => {
    return axiosClient.get(`/submission/${id}`);
}

const submissionApi = {
    getSubmissions,
    getSubmissionDetails,
}

export default submissionApi;