import axiosConfig from "./voteAxiosConfig";


export const voteApi = {
    getAll: () => axiosConfig.get(`/public/polls`),
    getById: (id) => axiosConfig.get(`/public/polls/${id}`),
    vote: (pollId, username, recaptcha) => axiosConfig.patch(`/public/polls/${pollId}/usernames/${username}?recaptcha=${recaptcha}`),
    getAllAdmin: (password) => axiosConfig.get(
        `/polls`,
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    getByIdAdmin: (password, id) => axiosConfig.get(
        `/polls/${id}`,
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
}
