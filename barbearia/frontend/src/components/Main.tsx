'use client';

import Header from './Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function Main() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            setLoading(false);
            setRole(null); // Garante que o papel seja resetado
            return;
        }

        const refreshAccessToken = async () => {
            try {
                const response = await api.post('/auth/refresh', {}, { withCredentials: true });

                const { token, userRole } = response.data;

                // Atualiza os tokens e o papel do usuário
                localStorage.setItem('accessToken', token);
                localStorage.setItem('role', userRole); // Atualiza a role no localStorage
                setRole(userRole); // Atualiza o estado
                console.log('Novo accessToken:', token);

                setLoading(false);
            } catch (error) {
                console.error('Erro ao renovar o access token:', error);
                setRole(null); // Reseta o papel em caso de erro
                setLoading(false);
            }
        };

        refreshAccessToken();
    }, []);

    const handleClick = () => {
        router.push('/Services');
    };

    const handleAdminClick = () => {
        router.push('/MenageServices');
    };

    // if (loading) {
    //     return <div>Carregando...</div>;
    // }

    // if (!role) {
    //     router.push('/Login');
    //     return <div>Usuário não autenticado. Redirecionando...</div>;
        
    // }
    return (
        <>
            <Header title="Bem-vindo à Barbearia" subtitle="Cortes, barbas e mais ao seu dispor"></Header>

            <main className="bg-gradient-to-b from-black to-[#434343] py-10 flex flex-col items-center justify-start min-h-screen">
                <h2 className="mb-2 text-white">Bem-vindo à nossa barbearia</h2>
                <p className="text-white">Aqui você faz seu agendamento de forma rápida e fácil!</p>

                <button onClick={handleClick} className="text-white mt-6 border-2 border-gray-300 rounded-full px-4 py-2">
                    Agende seu serviço
                </button>

                {role === 'admin' && (
                    <>
                        {console.log('Admin detected')} {/* Verificação para saber se o botão é renderizado */}
                        <button
                            onClick={handleAdminClick}
                            className="mt-4 text-white border-2 border-gray-300 rounded-full px-4 py-2"
                        >
                            Gerenciar serviços
                        </button>
                    </>
                )}
            </main>
        </>
    );
}
