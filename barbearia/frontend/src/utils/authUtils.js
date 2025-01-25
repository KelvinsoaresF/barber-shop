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
        // Não é necessário passar o refresh token diretamente, pois ele será enviado via cookie
        const response = await api.post('/auth/refresh');
        console.log("Novo token recebido:", response.data.token);
        localStorage.setItem('token', response.data.token); // Atualiza o access token
        localStorage.setItem('refreshToken', response.data.refreshToken); // Atualiza o refresh token
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

        // Verifica se o decodedToken é válido antes de tentar acessar a expiração
        if (!decodedToken || !decodedToken.exp) {
            console.error('Token inválido ou sem data de expiração');
            return false;
        }

        return Date.now() / 1000 > decodedToken.exp;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return false;
    }
};
