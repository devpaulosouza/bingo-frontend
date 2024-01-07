import axiosConfig from "./axiosConfig";


export const stopApi = {
    join: (credentials) => axiosConfig.post(`/games/stop/join`, credentials),
    get: (playerId) => axiosConfig.get(`/games/stop/users/${playerId}`),
    getAll: () => axiosConfig.get(`/games/stop`),
    setWord: (playerId, payload) => axiosConfig.post(`/games/stop/users/${playerId}/set-word`, payload),
    stop: (playerId) => axiosConfig.post(`/games/stop/users/${playerId}/stop`),
    invalidate: (playerId, payload) => axiosConfig.post(`/games/stop/users/${playerId}/validate-word`, payload),
    start: () => axiosConfig.post(`/games/stop/start`),
    kickAll: () => axiosConfig.post(`/games/stop/kick-all`)
}
