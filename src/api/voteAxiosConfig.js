import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_SAAPATONA_VOTE_API_URL
})
