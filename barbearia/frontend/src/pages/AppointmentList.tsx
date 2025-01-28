'use client'

import '@/app/globals.css'
import { useEffect, useState } from "react"
import api from '@/utils/axios'

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointment/appointments')
                console.log('Serviços recebidos:', res.data)
                setAppointments(res.data)
            } catch(error) {
                console.error('Erro ao carregar serviços', error)
            }
        }

        fetchAppointments()
    }, [])

    return (
        <main className='bg-gray-600 min-h-screen p-4'>
            <h1 className='text-2xl font-bold mb-4'>Agendamentos</h1>
            <div className='grid grid-cols-1 gap-4'>
                {appointments.map((appointment) => (
                    <div key={appointment.id} className='bg-white p-4 rounded-lg shadow-md'>
                        <h2 className='text-lg font-bold'>{appointment.service.name}</h2>
                        <p>Cliente: {appointment.user.name}</p>
                        <p>Email: {appointment.user.email}</p>
                        <p>Status: {appointment.status}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}