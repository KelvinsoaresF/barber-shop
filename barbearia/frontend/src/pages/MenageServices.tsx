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
                const res = await api.get('/service/services'); // Faz a requisição
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
                {/* aqui vai mostrar os serviços criados */}
            </div>


        </main>
    )

} 


