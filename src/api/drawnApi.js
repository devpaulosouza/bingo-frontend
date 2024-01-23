import axiosConfig from "./axiosConfig";

export const drawnApi = {
    getAll: (password) => axiosConfig.get(
        `/games/drawn`,
        {
            headers: {
                // Authorization: `Basic ${btoa(`admin:${password}`)}`
            }
        }
    )
}
