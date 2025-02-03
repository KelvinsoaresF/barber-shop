'use client'

import '@/app/globals.css'
import api from '@/utils/axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Services() {
    const [services, setServices] = useState([])  
    const [error, setError] = useState('')  
    const [success, setSuccess] = useState('') 
    const [token, setToken] = useState(null);  
    const router = useRouter()  

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/service/services');
                setServices(res.data);
            } catch (error) {
                console.error(error);
                setError('Erro ao carregar serviços');
            }
        };
        fetchServices();
    }, []);

    const handleRegister = async (serviceId) => {
        try {
            const res = await api.post('/appointment/appointments', { serviceId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                setSuccess('Agendamento realizado com sucesso');

                const addToCartRes = await api.post('/cart/cartAdd', { serviceId }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if(addToCartRes.status === 201) {
                    setSuccess('Serviço adicionado ao carrinho')
                   
                } else {
                    setError('Erro ao adicionar ao carrinho')
                }
            }

        } catch (error) {
            console.error('Erro:', error.response?.data)
            if (error.response?.status === 401) {
                setError('Token expirado. A renovação do token será tentada automaticamente.');
            } else if (error.response?.status === 400) {
                setError('ID do serviço é obrigatório.');
            } else if (error.response?.status === 404) {
                setError('Serviço não encontrado.');
            } else if (error.response?.status === 403 || error.response?.status === 401) {
                setError('Você não está autenticado. Faça login para continuar.');
            } else {
                setError('Erro ao criar agendamento. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <main className='bg-gray-600 min-h-screen p-4'>
            <h1 className='text-2xl font-bold mb-4'>Serviços disponíveis</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {services.map((service) => (
                    <div key={service.id} className='bg-white p-4 rounded-lg shadow-md'>

                    {error && <p className='text-red-500'>{error}</p>}
                    {success && <p className='text-green-500'>{success}</p>}

                        <img 
                            src={service.image}
                            alt="Imagem do serviço" 
                            className='w-full h-48 object-cover'
                        />
                        <div className='p-4'>
                            <h1 className='text-xl font-bold'>{service.name}</h1>
                            <p className='text-gray-700'>R${service.price.toFixed(2)}</p>
                        </div>

                        <button onClick={() => handleRegister(service.id)}
                            className='mt-2 bg-blue-600 text-white px-4 rounded-md'>
                                Agendar
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}

