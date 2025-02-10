'use client'

import { useEffect, useState } from "react"
import api from '@/utils/axios'
import '@/app/globals.css'

export default function AddSlots() {

    const [time, setTime] = useState("")
    const [slots, setSlots] = useState([])
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchSlots()
    }, [])

    const fetchSlots = async() => {
        try {
            
            const res = await api.get('/available/available')
        
            if (Array.isArray(res.data)) {
                setSlots(res.data);
            } else {
                console.error("A resposta do backend não é um array:", res.data);
                setSlots([]); // Evita erro se a resposta for inválida
            }


        } catch(error) {
            console.error('Erro ao carregar horarios', error)
            } 
        }

    const handleAddSlot = async() => {
        if (!time) {
            setError('Digite um horario')
            return
        }
        console.log('Horario enviado', {time})
        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/available/available', { time }, 
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            if (res.status === 201) {
                setSuccess('Horario adicionado')
                setSlots([...slots, res.data.slot])
                setTime("")
            }
        } catch (error) {
            console.error('Erro ao adicionar horario', error)
            setError('Erro ao adicionar horario')
            
        }
    }

    return (
        <div className="bg-gray-300 max-w-lg mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Adicionar horario</h2>

            <div className="flex gap-4 mb-6">
                <input 
                    type="text" 
                    placeholder="Ex: 14:00"
                    className="border p-2 rounded w-full" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <button
                    className="bg-blue-600 rounded-md"
                    onClick={handleAddSlot}
                >
                    Adicionar horario
                </button>
            </div>

                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <h3 className="text-xl font-semibold text-center mb-4">Horarios adicionados</h3>

                <ul className="border rounded-lg">
                    {slots.length > 0 ? (
                        slots.map((slot) => (
                            <li key={slot.id} className="p-2 border-b last:border-0">
                                {slot.time}
                            </li>
                        ))
                    ) : ( 
                        <p className="text-center text-gray-200">Nenhum horario disponivel</p>
                    )}
                </ul>
        </div>
    )
}