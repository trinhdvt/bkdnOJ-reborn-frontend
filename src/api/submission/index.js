import axiosClient from "api/axiosClient";

const getSubmissions = (params) => {
    return axiosClient.get('/submission/', (params && { params: {...params} }));
}
const getSubmissionDetails = ({id}) => {
    return axiosClient.get(`/submission/${id}`);
}
const adminDeleteSubmission = ({id}) => {
    return axiosClient.delete(`/submission/${id}`);
}
const getSubmissionResult = ({id}) => {
    return axiosClient.get(`/submission/${id}/testcase`);
}
const getSubmissionResultCase = ({id, case_num}) => {
    return axiosClient.get(`/submission/${id}/testcase/${case_num}`);
}

const submissionApi = {
    getSubmissions,
    getSubmissionDetails,
    getSubmissionResult,
    getSubmissionResultCase,

    adminDeleteSubmission,
}

export default submissionApi;