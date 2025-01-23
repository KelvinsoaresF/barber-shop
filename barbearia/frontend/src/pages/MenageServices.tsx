'use client'

import '@/app/globals.css'
import { useState, useEffect, } from "react"
import { useRouter } from "next/navigation"
import api from "@/utils/axios"

export default function MenageServices() {
    const [services, setServices] = useState([])
    const [showForm, setShowForm] = useState(false)
    const router = useRouter()
    
   
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/service/services'); 
                setServices(res.data); // Atualiza o estado com os serviços recebidos
            } catch (error) {
                console.error('Erro ao carregar serviços:', error.response?.data || error.message);
            }
        };

        fetchServices(); // Chama a função dentro do useEffect
    }, []);

    const handleNewService = () => {
        setShowForm(true)
        router.push('/Add-service')
    }

    return (
        <main className="bg-gray-500 min-h-screen flex flex-col items-center justify-center p-4">
            <h1>Gerenciar serviços</h1>
            <button
                onClick={handleNewService}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-700"            
            >
                Adicionar serviço
            </button>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {services.map((service) => (
                    <div 
                        key={service.id}
                        className='bg-white p-4 rounded-lg overflow-hidden shadow-md'
                    >
                        <img 
                            src={service.image}
                            alt="Imagem do serviço" 
                            className='w-full h-48 object-cover'
                        />

                        <div className='p-4'>
                            <h1 className='text-lg font-bold'>{service.name}</h1>
                            <p className='text-gray-800'>{service.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>


        </main>
    )

} 


