import { prisma } from '../models/prismaClient.js'

export const createAvailable = async (req, res) => {
    const { time } = req.body

    if(!time) {
        return res.status(400).json({ message: 'Horario obrigatorio' })
    }

    try {
        const slotExisting = await prisma.availableSlot.findUnique({
            where: { time }
        })
    
        if (slotExisting) {
            return res.status(400).json({ message: 'Este horario ja existe' })
        }
    
        const newSlot = await prisma.availableSlot.create({
            data: { time }
        })
    
        res.status(200).json({ message: 'Horario adicionado com sucesso' })
    } catch(error) {
        console.error('Erro ao criar horario', error)
        res.status(500).json({ message: 'Erro ao criar horario' })
    }
}
 
export const getAvailable = async (req, res) => {
    try {
        const slots = await prisma.availableSlot.findMany()
        res.status(200).json(slots)
    } catch (error) {
        console.erro('Erro ao buscar horarios', error)
        res.status(500).json({ message: 'Erro ao buscar horarios' })
    }

}