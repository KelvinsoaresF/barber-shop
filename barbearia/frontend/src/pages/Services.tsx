'use client'

import '@/app/globals.css'
import api from '@/utils/axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Services() {
    const [services, setServices] = useState([])  
    const [error, setError] = useState('')  
    const [success, setSuccess] = useState('') 
    const [token, setToken] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableDays, setAvailableDays] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/service/services');
                console.log('Serviços recebidos:', res.data);
                setServices(res.data);
            } catch (error) {
                console.error(error);
                setError('Erro ao carregar serviços');
            }
        };
        fetchServices();
    }, []);

    const handleSelectService = async (serviceId) => {
        setSelectedService(serviceId);
        setSelectedDay(null);
        setSelectedTime(null);
        setAvailableTimes([]);

        try {
            const res = await api.get('/available/available');
            setAvailableDays([...new Set(res.data.map(slot => slot.dayOfWeek))]);
        } catch (error) {
            console.error(error);
            setError('Erro ao buscar dias disponíveis');
        }
    };

    const handleSelectDay = async (dayOfWeek) => {
        setSelectedDay(dayOfWeek);
        setSelectedTime(null);

        try {
            const res = await api.get(`/available/available?dayOfWeek=${dayOfWeek}`);
            setAvailableTimes(res.data.map(slot => slot.time));
            console.log('Horários disponíveis:', res.data);
        } catch (error) {
            console.error(error);
            setError('Erro ao buscar horários disponíveis');
        }
    };

    const handleConfirmAppointment = async () => {
        if (!selectedService || !selectedDay || !selectedTime) {
            setError('Por favor, selecione um serviço, um dia e um horário.');
            return;
        }

        try {
            const res = await api.post('/appointment/appointments', {
                serviceId: selectedService,
                dayOfWeek: selectedDay,
                time: selectedTime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                setSuccess('Agendamento realizado com sucesso');

                try {
                    const addToCartRes = await api.post('/cart/cartAdd', 
                        { serviceId: selectedService }, 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (addToCartRes.status === 201) {
                        setSuccess('Serviço adicionado ao carrinho');
                        closeModal();
                        router.push('/CartPage');
                    } else {
                        setError('Erro ao adicionar ao carrinho');
                    }
                } catch (cartError) {
                    console.error(cartError);
                    setError('Erro ao adicionar ao carrinho.');
                }
            }
        } catch (error) {
            console.error(error);
            setError('Erro ao confirmar agendamento');
        }
    };

    const closeModal = () => {
        setSelectedService(null);
        setSelectedDay(null);
        setSelectedTime(null);
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

                        <button onClick={() => handleSelectService(service.id)}
                            className='mt-2 bg-blue-600 text-white px-4 rounded-md'>
                                Agendar
                        </button>
                    </div>
                ))}
            </div>
                
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Escolha o dia</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {availableDays.map((dayOfWeek, index) => (
                                <button 
                                    key={`${dayOfWeek}-${index}`}
                                    onClick={() => handleSelectDay(dayOfWeek)}
                                    className={`p-2 rounded-md ${selectedDay === dayOfWeek ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {dayOfWeek}
                                </button>
                            ))}
                        </div>

                        {selectedDay && (
                            <>
                                <h2 className="text-lg font-bold mt-4">Escolha o horário</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableTimes.map((time, index) => (
                                        <button 
                                            key={`${time}-${index}`}
                                            onClick={() => setSelectedTime(time)}
                                            className={`p-2 rounded-md ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex justify-between mt-4">
                            <button 
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Cancelar
                            </button>

                            <button 
                                onClick={handleConfirmAppointment}
                                className="bg-green-600 text-white px-4 py-2 rounded-md">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

