'use client'


import Header from "./Header"
import Link from "next/link"
import { useRouter } from "next/navigation" 
import { useEffect, useState } from "react"


export default function Main() {
    const router = useRouter()
    const [role, setRole] = useState(null)

    useEffect(() => {
        const storedRole = localStorage.getItem('role')
        console.log('Role recuperada do localStorage:', storedRole)  
        if (storedRole) {
            setRole(storedRole)
        }
    }, [])


    const handleClick = () => {
        router.push('/Services')
    }

    const handleAdminClick = () => {
        router.push('/MenageServices')
    }

    return (
        <>
        <Header  title="Bem-vindo à Barbearia" 
         subtitle="Cortes, barbas e mais ao seu dispor">
         
         </Header>

        <main className="bg-gradient-to-b from-black to-[#434343] py-10 flex flex-col items-center justify-start min-h-screen">
            <h2 className="mb-2 text-white">Bem vindo a nossa barbearia</h2>
            <p className="text-white">Aqui você faz seu agendamento de forma rapida e facil!</p>
            <Link href="/Services">
                <button onClick={handleClick} className=" text-white mt-6 border-2 border-gray-300  rounded-full px-4 py-2">
                    Agende seu serviço
                </button>
            </Link>

            {role === 'admin' && (
                <>
                    {console.log("Admin detected")}  {/* Verificação para saber se o botão é renderizado */}
                    <button onClick={handleAdminClick} className="mt-4 text-white border-2 border-gray-300 rounded-full px-4 py-2">
                        Gerenciar serviços
                    </button>
                </>
            )}
            
            
        </main>
        </>
    )
}