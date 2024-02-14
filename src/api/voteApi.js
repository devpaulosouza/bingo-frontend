import axiosConfig from "./voteAxiosConfig";


export const voteApi = {
    getAll: () => axiosConfig.get(`/public/polls`),
    getById: (id) => axiosConfig.get(`/public/polls/${id}`),
    vote: (pollId, username, recaptcha) => axiosConfig.patch(`/public/polls/${pollId}/usernames/${username}?recaptcha=${recaptcha}`),
}
