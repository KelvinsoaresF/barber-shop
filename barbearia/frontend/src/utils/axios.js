import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Para enviar cookies automaticamente
});

// Interceptor para verificar expiração do Access Token
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Se o erro for de token expirado
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // O refreshToken é automaticamente enviado com os cookies devido ao `withCredentials: true`
                const response = await api.post('/auth/refresh'); // Não precisa enviar manualmente o refresh token

                localStorage.setItem('token', response.data.token); // Atualiza o access token
                localStorage.setItem('refreshToken', response.data.refreshToken); // Atualiza o refresh token

                // Adiciona o novo token na requisição original
                originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;

                return axios(originalRequest); // Refaz a requisição original
            } catch (error) {
                console.error('Erro ao renovar o token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                router.push('/login'); // Redireciona para login
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);


export default api;

