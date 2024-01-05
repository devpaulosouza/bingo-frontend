import axiosConfig from "./axiosConfig";

export const bingoApi = {
    join: (credentials) => axiosConfig.post('/games/bingo/join', credentials),
    mark: (request) => axiosConfig.post('/games/bingo/mark', request),
    bingo: (playerId) => axiosConfig.post(`/games/bingo/users/${playerId}/bingo`),
    getByPlayerId: (playerId) => axiosConfig.get(`/games/bingo/users/${playerId}`),
    getAll: () => axiosConfig.get(`/games/bingo/admin`),
    start: () => axiosConfig.post(`/games/bingo/start`),
    restart: () => axiosConfig.post(`/games/bingo/clean`),
    hasPassword: () => axiosConfig.get(`/games/bingo/has-password`),
}
