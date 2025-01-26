import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prismaClient.js'; 
import dotenv from 'dotenv';
import cookie from 'cookie';

dotenv.config(); 
const router = express.Router();

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

        res.json({ token, refreshToken, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// Rota de Registro de Usuário
router.post("/register", async (req, res) => {
    const { name, email, password, role, keyAdm } = req.body;

    console.log("Dados recebidos:", { name, email, password, role, keyAdm });

    if (!name || !email || !password) {
        return res.status(401).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já em uso' });
        }

        if (role === 'admin' && keyAdm !== process.env.ADMIN_KEY) {
            return res.status(403).json({ error: 'Chave de acesso inválida!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                keyAdm: keyAdm || null
            }
        });

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

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', token, refreshToken });
    } catch (error) {
        console.error("Erro ao criar o usuário", error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário', details: error.message });
    }
});

// Função para Atualizar o Access Token
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.cookies; // Certifique-se de que o cookie está sendo recebido

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token é necessário' });
    }

    try {
        console.log('Recebendo Refresh Token:', refreshToken);

        // Verifica se o token já foi revogado no banco de dados
        const revokedToken = await prisma.RevokedTokens.findUnique({
            where: { token: refreshToken },
        });

        if (revokedToken) {
            return res.status(401).json({ error: 'Refresh token inválido' });
        }

        // Verifica se o Refresh Token é válido
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log('Decoded Refresh Token:', decoded);  // Para verificar se o token é válido

        // Salva o Refresh Token no banco de dados como revogado
        await prisma.RevokedTokens.create({
            data: {
                token: refreshToken, // Salva o refresh token atual como revogado
            }
        });

        // Gera novos tokens
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

        // Define o novo refresh token como cookie
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Certifique-se de usar 'https' em produção
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 dias
                path: '/',
            })
        );

        // Envia o novo access token
        res.json({ token: newAccessToken });

    } catch (error) {
        console.error('Erro ao verificar refresh token:', error);
        res.status(401).json({ error: 'Refresh token inválido', details: error.message });
    }
});

export default router;
