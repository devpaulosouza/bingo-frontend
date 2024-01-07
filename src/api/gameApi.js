import axiosConfig from "./axiosConfig";


export const gameApi = {
    getConfig: () => axiosConfig.get(`/games/config`),
}
