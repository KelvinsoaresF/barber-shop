import { prisma } from '../models/prismaClient.js'; 

export const addService = async (req, res) => {
    try {
        const { name, price, image} = req.body 
        
        if (!name || !price) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const newService = await prisma.service.create({
            data: { 
                name, 
                price: parseFloat(price), 
                image: null
            }
        })

        res.status(201).json({ message: 'Serviço criado com sucesso', service: newService})
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar serviço', details: error })
    }
}
