import jwt from 'jsonwebtoken';
import api from './axios';

export const refreshAccessToken = async () => {
    if (typeof window === 'undefined') {
        console.warn('Tentativa de usar localStorage no ambiente do servidor');
        return;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    console.log("Refresh Token:", refreshToken);

    if (!refreshToken) {
        console.log("Refresh token não encontrado. Redirecionando para Login...");
        window.location.href = '/Login';
        return;
    }

    try {
        const response = await api.post('auth/refresh', { refreshToken });
        console.log("Novo token recebido:", response.data.token);
        localStorage.setItem('token', response.data.token);
    } catch (err) {
        console.error('Erro ao atualizar token', err);
        window.location.href = '/Login';
    }
};

export const isTokenExpired = (token) => {
    if (typeof window === 'undefined') {
        console.warn('Tentativa de usar jwt.decode no ambiente do servidor');
        return false;
    }

    try {
        const decodedToken = jwt.decode(token);
        console.log("Token decodificado:", decodedToken);
        return decodedToken && Date.now() / 1000 > decodedToken.exp;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return false; // Se houver erro, retorna false
    }
};