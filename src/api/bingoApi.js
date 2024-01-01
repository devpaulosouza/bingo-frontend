import axiosConfig from "./axiosConfig";

export const bingoApi = {
    join: (credentials) => axiosConfig.post('/game/join', credentials),
    mark: (request) => axiosConfig.post('/game/mark', request),
    bingo: (playerId) => axiosConfig.post(`/game/users/${playerId}/bingo`),
    getByPlayerId: (playerId) => axiosConfig.get(`/game/users/${playerId}`),
}
