


import { useState } from "react";
import api from "@/utils/axios";
import '@/app/globals.css'
import Button from "@/components/Button";

import { useRouter } from "next/navigation";

export default function Register() {
    
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('cliente')
    const [keyAdm, setKeyAdm] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        console.log('Chave ADM:', process.env.NEXT_PUBLIC_ADMIN_KEY)
        console.log('Chave recebida:', keyAdm);
        console.log('Chave esperada:', process.env.NEXT_PUBLIC_ADMIN_KEY);

        if (role === 'admin' && keyAdm !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
            return setError('A chave de adm é obrigatoria!')
        }

        try {
            const response = await api.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role,
                keyAdm: role === 'admin' ? keyAdm : ''
            })

            console.log('Resposta do backend:', response.data);
            setSuccess('Usuario criado com sucesso')
            console.log('Token:', response.data.token)
            router.push('/')
        } catch (err) {
            console.error('Erro no backend:', err.response); 
            setError(err.response?.data?.error || 'Erro ao registrar usuario')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-[#434343] flex items-center justify-center">
            <div className="bg-white p-8 rounded-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-600">
                    Registro de cliente
                </h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-red-500 text-center">{success}</p>}
                <form onSubmit={handleRegister} className="spacex-4">
                    <div>
                        <label 
                            htmlFor="name" 
                            className="text-gray-600 block text-sm font-medium focus:ring-blue-500 focus:border-blue-500">
                            Nome
                        </label>
                        <input 
                        id="name"
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-gray-500 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                        placeholder="Digite seu nome"
                        required
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor="email"
                        className="text-gray-600 block text-sm font-medium focus:ring-blue-500 focus:border-blue-500"
                        >
                        Email
                        </label>

                        <input 
                        id="email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                        placeholder="Digite seu email"
                        required
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor="password" 
                        className="text-gray-600 block text-sm font-medium focus:ring-blue-500 focus:border-blue-500"
                        >
                            Senha
                        </label>
                        <input 
                        id="password"
                        type="text" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                        placeholder="Digite sua senha"
                        required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Tipo de usuario</label>
                        <div className="flex items-center">
                            <input 
                            type="radio" 
                            id="cliente"
                            name="role"
                            value="cliente"
                            checked={role === 'cliente'}
                            onChange={() => setRole('cliente')}
                            className="mr-2 "
                            />
                            <label htmlFor="cliente" className="text-gray-600">Cliente</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                            type="radio" 
                            id="adm"
                            name="role"
                            value="admin"
                            checked={role === 'admin'}
                            onChange={() => setRole('admin')}
                            className="mr-2"
                            />
                            <label htmlFor="admin" className="text-gray-600">Administrador</label>
                        </div>
                    </div>

                    {role === 'admin' && (
                        <div>
                            <label 
                            htmlFor="keyAdm"
                            className="text-gray-600 block text-sm font-medium"
                            >
                                Chave de acesso (ADM)
                            </label>
                            <input 
                            id="keyAdm"
                            type="text" 
                            value={keyAdm}
                            onChange={(e) => setKeyAdm(e.target.value)}
                            className="text-gray-600 w-full p-3 border border-gray-600 rounded-lg shadow-sm" 
                            placeholder="Digite a chave de acesso"
                            required={role === 'admin'}
                            />
                        </div>
                    )}

                    <Button color="bg-green-500" text="Criar" className="w-full mt-4" /> 
                    

                </form>
            </div>
        </div>
    )


}