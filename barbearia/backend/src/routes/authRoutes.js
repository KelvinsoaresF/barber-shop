import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prismaClient.js'; 
import dotenv from 'dotenv';

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

        if (role === 'adm' && keyAdm !== process.env.ADMIN_KEY) {
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
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

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

        res.json({ token: newAccessToken });
    } catch (error) {
        res.status(401).json({ error: 'Refresh token inválido' });
    }
});

export default router;


