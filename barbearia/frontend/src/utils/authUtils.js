import jwt from 'jsonwebtoken';
import api from './axios';

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        // window.location.href = '/Login';
        return
    }

    try {
        const response = await api.post('http://localhost:5000/api/auth/refresh', { refreshToken })
        localStorage.setItem('token', response.data.token)
    } catch (err) {
        console.log('Erro ao atualizar token', err)
        // window.location.href = '/Login'
    }
}

export const isTokenExpired = (token) => {
    const decodedToken = jwt.decode(token)
    return decodedToken && Date.now() / 1000 > decodedToken.exp
}