import axiosClient from "api/axiosClient";

const getContests = (params) => {
    return axiosClient.get('/contest/', (params && { params: {...params} }));
}
const getAllContests = (params) => {
    return axiosClient.get('/all-contest/', (params && { params: {...params} }));
}
const getPastContests = (params) => {
    return axiosClient.get('/past-contest/', (params && { params: {...params} }));
}

const getContest = ({ key }) => {
    return axiosClient.get(`/contest/${key}/`);
}
const joinContest = ({ key }) => {
    return axiosClient.post(`/contest/${key}/participate/`);
}
const leaveContest = ({ key }) => {
    return axiosClient.post(`/contest/${key}/leave/`);
}
const getContestStanding = ({ key }) => {
    return axiosClient.get(`/contest/${key}/standing/`);
}
const getContestParticipations = ({ key, params }) => {
    return axiosClient.get(`/contest/${key}/participations/`, (params && { params: {...params} }));
}
const getContestSubmissions = ({ key, params }) => {
    return axiosClient.get(`/contest/${key}/submission/`, (params && { params: {...params} }));
}

const getContestProblems = ({ key, params }) => {
    return axiosClient.get(`/contest/${key}/problem/`, (params && { params: {...params} }));
}
const updateContestProblems = ({ key, data }) => {
    return axiosClient.post(`/contest/${key}/problem/`, data); // actually patching
}


const getContestProblem = ({ key, shortname, params }) => {
    return axiosClient.get(`/contest/${key}/problem/${shortname}/`, (params && { params: {...params} }));
}
const submitContestProblem = ({ key, shortname, data }) => {
    return axiosClient.post(`/contest/${key}/problem/${shortname}/submit/`, JSON.stringify(data) );
}
const getContestProblemSubmissions = ({ key, shortname, params }) => {
    return axiosClient.get(`/contest/${key}/problem/${shortname}/submission/`, (params && { params: {...params} }));
}
const getContestProblemSubmission = ({ key, shortname, id }) => {
    return axiosClient.get(`/contest/${key}/problem/${shortname}/submission/${id}/`);
}

const createContest = ({data}) => {
    return axiosClient.post(`/contest/`, data);
}

const deleteContest = ({ key }) => {
    return axiosClient.delete(`/contest/${key}/`);
}
const updateContest = ({ key, data }) => {
    return axiosClient.patch(`/contest/${key}/`, data);
}

const contestAPI = {
    getAllContests,
    getContests, getPastContests, getContest,

    joinContest, leaveContest,

    getContestStanding,
    getContestSubmissions,
    getContestParticipations,

    // ContestProblem
    getContestProblems, getContestProblem, submitContestProblem,
    updateContestProblems,

    getContestProblemSubmissions, getContestProblemSubmission,

    createContest, deleteContest, updateContest,
}

export default contestAPI;
