import axiosClient from "api/axiosClient";

const getOrgs = ({params}) => {
    return axiosClient.get('/orgs/', (params && { params: {...params} }));
}

const getMyOrgs = () => {
    return axiosClient.get('/orgs/my/', );
}

const createOrg = ( data ) => {
    return axiosClient.post(`/orgs/`, data );
}

const getOrg = ({ slug, params }) => {
    return axiosClient.get(`/org/${slug}/`, (params && { params: {...params} }));
}

const updateOrg = ({ slug, data }) => {
    return axiosClient.patch(`/org/${slug}/`, data);
}

const deleteOrg = ({ slug }) => {
    return axiosClient.delete(`/org/${slug}/`);
}

const createSubOrg = ({ parentSlug, data }) => {
    return axiosClient.post(`/org/${parentSlug}/orgs/`, data );
}

const getOrgMembers = ({ slug, params }) => {
    return axiosClient.get(`/org/${slug}/members/`, (params && { params: {...params} }));
}

const addOrgMembers = ({ slug, data }) => {
    return axiosClient.post(`/org/${slug}/members/`, data);
}
const removeOrgMembers = ({ slug, data }) => {
    return axiosClient.delete(`/org/${slug}/members/`, {data});
}

const orgAPI = {
    getOrgs, getMyOrgs,
    createOrg,
    getOrg, updateOrg, deleteOrg,
    createSubOrg,

    getOrgMembers,
    addOrgMembers,
    removeOrgMembers,
}

export default orgAPI;
