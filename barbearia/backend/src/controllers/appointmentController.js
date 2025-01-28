import { prisma } from "../models/prismaClient.js";

export const creatAppointment = async (req, res) => {
    const { serviceId } = req.body;
    const userId = req.user?.id; // Obtém o userId do middleware de autenticação

    console.log('serviceId:', serviceId);
    console.log('userId:', userId);


    if (!serviceId) {
        return res.status(400).json({ message: "Service ID is required" });
    }

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Verifica se o serviço existe
        const serviceExists = await prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!serviceExists) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Cria o agendamento
        const newAppointment = await prisma.appointment.create({
            data: {
                serviceId,
                userId,
                date: new Date(),
                status: "Pendente",
            },
        });
        console.log("Agendamento criado com sucesso", newAppointment);
        return res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Erro ao criar agendamento", error);
        return res.status(500).json({ message: "Erro ao criar agendamento" });
    }
};

export const getAppointmentByUser = async (req, res) => {
    const userId = req.user?.id; // Obtém o userId do middleware de autenticação

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Busca agendamentos do usuário
        const appointments = await prisma.appointment.findMany({
            where: { userId },
            include: {
                service: true, // Inclui os dados do serviço relacionado
            },
        });

        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Erro ao buscar agendamentos", error);
        return res.status(500).json({ message: "Erro ao buscar agendamentos" });
    }
};
