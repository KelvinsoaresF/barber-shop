import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    // Primeiro tenta obter o token do cabeçalho "Authorization"
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];

    // Caso o token não esteja no cabeçalho, tenta buscar nos cookies
    const tokenFromCookie = req.cookies?.token;

    // Usa o token disponível (do cabeçalho ou do cookie)
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId, role: decoded.role };// Decodifica o token e adiciona as informações ao req.user
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
};

export default checkAuth;

