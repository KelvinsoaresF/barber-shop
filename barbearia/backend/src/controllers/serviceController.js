import { prisma } from '../models/prismaClient.js'; 


export const addService = async (req, res) => {
    try {

        console.log("Corpo da requisição:", req.body);
        console.log("Arquivo recebido:", req.file);

        const { name, price,} = req.body 
        const image = req.file ? `http://localhost:8000/uploads/${req.file.filename.replace(/\\/g, '/')}` : null;
        
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
        console.log(req.body)
        const services = await prisma.service.findMany();

        const updatedServices = services.map(service => {
            // Verifica se a URL já contém o domínio
            if (!service.image.startsWith('http')) {
                service.image = `http://localhost:8000${service.image.replace(/\\/g, '/')}`;
            }
            return service;
        });
        res.status(200).json(updatedServices);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços', details: error })
    }

}



// export const deleteService = async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log("ID recebido:", id);

//         console.log("Requisição DELETE recebida:", req.params);
        
      
//         const service = await prisma.service.findUnique({
//             where: { id: Number(id) },
//         })

//         if(!service) {
//             return res.status(404).json({ error: 'Serviço não encontrado' })
//         }

//        if (service.image) {
//             console.log("Imagem a ser deletada:", service.image);
//             const imagePath = path.join('uploads', path.basename(service.image));

//             if (fs.existsSync(imagePath)) {
//                 console.log("Imagem encontrada no servidor, deletando...");
//                 fs.unlink(imagePath, (err) => {
//                     if (err) console.error("Erro ao deletar imagem:", err);
//                 });
//             } else {
//                 console.warn("Imagem não encontrada no servidor:", imagePath);
//             }
//         }

//         await prisma.service.delete({
//             where: { id: Number(id) },
//         })

//         res.status(200).json({ message: 'Serviço deletado com sucesso' })

//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao deletar serviço', details: error })
//     }
// }

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recebido:", id);

        console.log("Requisição DELETE recebida:", req.params);
        
        const service = await prisma.service.findUnique({
            where: { id: Number(id) },
        });

        if (!service) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        if (service.image) {

                        console.log("Imagem a ser deletada:", service.image);
                        const imagePath = path.join('uploads', path.basename(service.image));
            
                        if (fs.existsSync(imagePath)) {
                            console.log("Imagem encontrada no servidor, deletando...");
                            fs.unlink(imagePath, (err) => {
                                if (err) console.error("Erro ao deletar imagem:", err);
                            });
                        } else {
                            console.warn("Imagem não encontrada no servidor:", imagePath);
                        }
                    }

        await prisma.service.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'Serviço deletado com sucesso' });

    } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        res.status(500).json({ error: 'Erro ao deletar serviço', details: error.message });
    }
};
