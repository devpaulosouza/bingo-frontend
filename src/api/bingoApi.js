import axiosConfig from "./axiosConfig";

export const bingoApi = {
    join: (credentials) => axiosConfig.post('/games/bingo/join', credentials),
    mark: (request) => axiosConfig.post('/games/bingo/mark', request),
    bingo: (playerId) => axiosConfig.post(`/games/bingo/users/${playerId}/bingo`),
    getByPlayerId: (playerId) => axiosConfig.get(`/games/bingo/users/${playerId}`),
    getAll: () => axiosConfig.get(
        `/games/admin/bingo`,
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    start: (password) => axiosConfig.post(
        `/games/admin/bingo/start`,
        {},
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    restart: (password) => axiosConfig.post(
        `/games/admin/bingo/clean`,
        {},
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    kickAll: (password) => axiosConfig.post(
        `/games/admin/bingo/kick-all`,
        {},
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    hasPassword: () => axiosConfig.get(`/games/bingo/has-password`),
}
