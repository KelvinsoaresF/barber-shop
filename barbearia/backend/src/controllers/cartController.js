import { prisma } from "../models/prismaClient.js";

export const addToCart = async (req, res) => {
    
    try {
        const { serviceId } = req.body
        const userId = req.user.id

        console.log("Adicionando ao carrinho:", { serviceId, userId });

        const existingItem = await prisma.cart.findFirst({
            where: { userId, serviceId }
        })

        if (existingItem) {
            return res.status(400).json({ message: "Serviço ja adicionado ao carrinho" })
        }

        const newItem = await prisma.cart.create({
            data: {
                userId,
                serviceId,
                quantity: 1
            }
        })

        console.log("Carrinho atualizado:", newItem);
        res.status(201).json({ message:'Serviço adicionado ao carrinho', cart: newItem })
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao adicionar serviço ao carrinho' })
    }
} 

export const getCartItems = async (req, res) => {
    try {
        console.log("Requisição chegou ao backend!")

        const userId = req.user.id
        const cart = await prisma.cart.findMany({
            where: { userId },
            include: {
                user: true,
                service: true,
                // appointment: true
            }
        })
        console.log("Carrinho do usuário:", cart);

        res.status(200).json(cart)
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar items no carrinho' })
    }
}

export const removeToCart = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);  
        const userId = req.user.id

        const cartItem = await prisma.cart.findFirst({
            where: { userId, serviceId }
        })

        if (!cartItem) {
            return res.status(400).json({ message: "Serviço não encontrado" })
        }

        await prisma.cart.delete({
            where: { id: cartItem.id }
        })
       
        res.status(200).json({ message: "Serviço removido do carrinho" })
      
        
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao remover serviço do carrinho' })
    }
}