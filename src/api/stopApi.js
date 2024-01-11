import axiosConfig from "./axiosConfig";


export const stopApi = {
    join: (credentials) => axiosConfig.post(`/games/stop/join`, credentials),
    get: (playerId) => axiosConfig.get(`/games/stop/users/${playerId}`),
    getAll: () => axiosConfig.get(`/games/stop`),
    setWord: (playerId, payload) => axiosConfig.post(`/games/stop/users/${playerId}/set-word`, payload),
    stop: (playerId) => axiosConfig.post(`/games/stop/users/${playerId}/stop`),
    invalidate: (playerId, payload) => axiosConfig.post(`/games/stop/users/${playerId}/validate-word`, payload, {
        headers: {
            "Content-Type": 'application/json'
        }
    }),
    start: (password) => axiosConfig.post(
        `/games/admin/stop/start`,
        {},
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    kickAll: (password) => axiosConfig.post(
        `/games/admin/stop/kick-all`,
        {},
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    hasPassword: () => axiosConfig.get(`/games/stop/has-password`),
}
