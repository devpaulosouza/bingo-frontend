import axios from "axios";

export default axios.create({
    // baseURL: 'http://localhost:8080'
    // baseURL: 'http://192.168.100.97:8080'
    baseURL: 'https://sapalimpiadas-backend-76a8b1cd1095.herokuapp.com/'
})
