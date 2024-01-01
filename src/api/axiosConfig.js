import axios from "axios";

export default axios.create({
    // baseURL: 'http://localhost:8080'
    // baseURL: 'http://192.168.100.97:8080'
    baseURL: 'https://murmuring-bastion-37173-86d7c2307b3e.herokuapp.com/'
})
