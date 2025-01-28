import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prismaClient.js';
import dotenv from 'dotenv';
import cookie from 'cookie';
import cors from 'cors';

dotenv.config();
const router = express.Router();

// Configuração do CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Substitua pelo URL correto do seu frontend
    credentials: true,
};
router.use(cors(corsOptions));

// Rota de Registro
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    try {
        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'cliente', // Define o papel padrão como 'cliente'
            },
        });

        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: newUser.id });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao registrar o usuário.' });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        // Configura o refreshToken no cookie
        res.setHeader('Set-Cookie', cookie.serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Certifique-se de usar HTTPS em produção
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: '/',
        }));

        res.status(200).json({
            token,
            role: user.role,
            message: 'Login realizado com sucesso',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// Rota para Atualizar o Access Token com o Refresh Token
router.post('/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token é necessário' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Define o novo refreshToken no cookie
        res.setHeader('Set-Cookie', cookie.serialize('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        }));

        res.status(200).json({ 
            token: newAccessToken,  // Envia o novo access token
        });
    } catch (err) {
        console.error('Erro ao verificar refresh token:', err);
        res.status(401).json({ error: 'Refresh token inválido' });
    }
});

export default router;
