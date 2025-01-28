import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,  // Permite o envio de cookies
});

api.interceptors.response.use(
    (config) => {
        const token = localStorage.getItem('token'); // Pega o token do localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token ao cabeçalho
        }
        return config;
    },
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get('refreshToken');
            
            if (!refreshToken) {
                console.error('Refresh Token não encontrado. O usuário precisa fazer login novamente.');
                // Redirecionar para login ou outro tratamento
                return Promise.reject(error);
            }

            try {
                const response = await api.post('/auth/refresh'); // Rota de refresh
                Cookies.set('refreshToken', response.data.refreshToken); // Armazena o novo refresh token
                localStorage.setItem('token', response.data.token);  // Armazena o novo access token

                originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                return axios(originalRequest);
            } catch (err) {
                console.error('Erro ao renovar o token', err);
                // Redirecionar para login ou tratar falha
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;







