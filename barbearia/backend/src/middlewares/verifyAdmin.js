import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;

export const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não informado' });
        }

        const token = authHeader.startWith('Bearer') ? authHeader.split('')[1] : null
        
        if(!token) {
            return res.status(401).json({ message: 'Token invalido' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token invalido ou expirado' });
            }

            if (decoded.role !== 'admin') {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            req.user = decoded
            next()
        })
    } catch(error) {
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}