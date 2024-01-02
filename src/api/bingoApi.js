import axiosConfig from "./axiosConfig";

export const bingoApi = {
    join: (credentials) => axiosConfig.post('/game/join', credentials),
    mark: (request) => axiosConfig.post('/game/mark', request),
    bingo: (playerId) => axiosConfig.post(`/game/users/${playerId}/bingo`),
    getByPlayerId: (playerId) => axiosConfig.get(`/game/users/${playerId}`),
    getAll: () => axiosConfig.get(`/game/admin`),
    start: () => axiosConfig.post(`/game/start`),
    restart: () => axiosConfig.post(`/game/clean`),
    hasPassword: () => axiosConfig.get(`/game/has-password`),
}
