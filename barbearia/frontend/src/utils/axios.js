import axios from "axios";
import { refreshAccessToken, isTokenExpired } from "./authUtils";


const api = axios.create({
    baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token')
        if (token && isTokenExpired(token)) {
            await refreshAccessToken()
            token = localStorage.getItem('token')
        }

        
        config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api