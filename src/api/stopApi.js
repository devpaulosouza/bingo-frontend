import axiosConfig from "./axiosConfig";


export const stopApi = {
    join: (credentials) => axiosConfig.post(`/games/stop/join`, credentials),
    get: (playerId) => axiosConfig.get(`/games/stop/users/${playerId}`),
}
