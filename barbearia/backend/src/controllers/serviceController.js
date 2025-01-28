import { prisma } from '../models/prismaClient.js'; 

export const addService = async (req, res) => {
    try {

        console.log("Corpo da requisição:", req.body);
        console.log("Arquivo recebido:", req.file);

        const { name, price,} = req.body 
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        
        if (!name || !price) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        if (isNaN(parseFloat(price) <=0)) {
            return res.status(400).json({ error: 'Preço inválido' });
        }

        const newService = await prisma.service.create({
            data: { 
                
                name, 
                price: parseFloat(price), 
                image
            }
        })

        res.status(201).json({ message: 'Serviço criado com sucesso', service: newService})
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar serviço', details: error })
        details: error.message
        stack: error.stack

    }
}

export const getServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany();

        const updatedServices = services.map(service => {
            // Verifica se a URL já contém o domínio
            if (!service.image.startsWith('http')) {
                service.image = `http://localhost:5000${service.image.replace(/\\/g, '/')}`;
            }
            return service;
        });
        res.status(200).json(updatedServices);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços', details: error })
    }
}
