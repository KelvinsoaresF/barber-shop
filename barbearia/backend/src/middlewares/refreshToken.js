import jwt from 'jsonwebtoken';
import { prisma } from '../models/prismaClient.js';

export const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies.refreshToken; // Pega o refresh token

  if (!refreshToken) {
    console.log('Refresh token não fornecido');
    return res.status(401).json({ message: 'Refresh token não fornecido' });
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        console.log('Erro ao verificar refresh token:', err);
        return res.status(403).json({ message: 'Refresh token inválido ou expirado' });
      }

      // O refresh token é válido, agora cria o novo Access Token
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        console.log('Usuário não encontrado');
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }  // Expira em 1 hora
      );

      console.log('Novo access token gerado');
      return res.json({ token: newAccessToken });
    });
  } catch (error) {
    console.error('Erro ao tentar renovar o token:', error);
    return res.status(500).json({ message: 'Erro ao renovar o token' });
  }
};
