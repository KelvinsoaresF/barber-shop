import { prisma } from '../models/prismaClient.js'; 
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token não encontrado' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        })

        if (!user) {
            return res.status(404).json({ message: 'message: Usuario não encontrado' })
        }

        return res.json({
            name: user.name,
            role: user.role,
        })
        
    } catch (error) {
        console.error('Erro ao buscar usuario', error)
        return res.status(500).json({ message: 'Erro no servidor' })
    }
}

