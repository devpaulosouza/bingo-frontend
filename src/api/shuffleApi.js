import axiosConfig from "./axiosConfig";

export const shuffleApi = {
    join: (credentials) => axiosConfig.post('/games/shuffle/join', credentials),
    getByPlayerId: (playerId) => axiosConfig.get(`/games/shuffle/players/${playerId}`),
    setWords: (playerId, payload) => axiosConfig.post(`/games/shuffle/players/${playerId}/set-words`, payload),
    unfocus: (playerId) => axiosConfig.patch(`/games/shuffle/players/${playerId}/unfocused`),
    getAll: (password) => axiosConfig.get(
        `/games/shuffle`,
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    start: (password, payload) => axiosConfig.post(
        `/games/admin/shuffle/start`,
        payload,
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    kickAll: (password) => axiosConfig.post(
        `/games/admin/shuffle/kick-all`,
        {},
        {
            headers: {
                Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    ),
    hasPassword: () => axiosConfig.get(`/games/shuffle/has-password`),
}
