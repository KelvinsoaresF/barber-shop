import { prisma } from '../models/prismaClient'

export const createUser = async (nome, email, password, role = 'cliente') => {
    try {
        const user = await  prisma.user.create({
            data: {
                nome, 
                email,
                password,
                role,
            },
        })
        return user
    } catch (error) {
        throw new Error('Erro ao criar o usuario' + error.message)
    }
}

export const findUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email, 
            },
        })
        return user

    } catch (error) {
        throw new Error('Erro ao buscar usuario' + error.message)
    }
}

export const updateUser = async (id, dadosAtualizados) => {
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: dadosAtualizados
        })
        return user
    } catch (error) {
        throw new Error ('Erro ao atualizar usuario' + error.message)
    }
}

