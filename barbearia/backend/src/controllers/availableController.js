import { prisma } from '../models/prismaClient.js'

export const createAvailable = async (req, res) => {
    console.log("Requisição recebida:", req.body);
    const { time, dayOfWeek } = req.body

    if(!time || !dayOfWeek) {
        return res.status(400).json({ message: 'Horario obrigatorio e dia da semana são obrigatorios' })
    }

    try {
        const slotExisting = await prisma.availableSlot.findFirst({
            where: { time, dayOfWeek }
        })
    
        if (slotExisting) {
            return res.status(400).json({ message: 'Este horario ja existe' })
        }
    
        const newSlot = await prisma.availableSlot.create({
            data: { time, dayOfWeek }  
        })
    
        res.status(201).json({ message: 'Horario adicionado com sucesso', slot: newSlot })
    } catch(error) {
        console.error('Erro ao criar horario', error)
        res.status(500).json({ message: 'Erro ao criar horario' })
    }
}
 
export const getAvailable = async (req, res) => {
    const { dayOfWeek } = req.query

    try {
        const slots = await prisma.availableSlot.findMany({
            where: dayOfWeek ? { dayOfWeek } : {}
        })

        res.status(200).json(slots)
    } catch (error) {
        console.error('Erro ao buscar horarios', error)
        res.status(500).json({ message: 'Erro ao buscar horarios' })
    }
}

export const getDay = async (req, res) => {
    const {dayOfWeek} = req.params
} 