import axiosConfig from "./axiosConfig";


export const stopApi = {
    join: (credentials) => axiosConfig.post(`/games/stop/join`, credentials),
    get: (playerId) => axiosConfig.get(`/games/stop/users/${playerId}`),
    setWord: (playerId, payload) => axiosConfig.post(`/games/stop/users/${playerId}/set-word`, payload),
    stop: (playerId) => axiosConfig.post(`/games/stop/users/${playerId}/stop`),
    invalidate: (playerId, payload) => axiosConfig.post(`/games/stop/users/${playerId}/validate-word`, payload),
}
