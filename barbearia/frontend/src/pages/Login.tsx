import { useState } from "react";
import api from "@/utils/axios";
// import LoginPage from "@/components/LoginPage";
import '@/app/globals.css'
import Button from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    // Estados para armazenar email, senha, mensagens de erro e sucesso
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Função de login
    const handleLogin = async (e) => {
        e.preventDefault(); // Evita o reload da página ao submeter o formulário
        setError('');
        setSuccess('');

        try {
            // Envia os dados de email e senha para o servidor
            const response = await api.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });



            localStorage.setItem('token', response.data.token)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            localStorage.setItem('role', response.data.role)

            console.log('Token:', response.data.token);
            console.log('Refreshed', response.data.refreshToken)
            console.log('Role:', response.data.role);

            // Exibe mensagem de sucesso e armazena o token (se necessário)
            setSuccess('Login realizado com sucesso',);
            console.log('Token:', response.data.token);
            router.push('/')

        } catch (err) {
            // Exibe o erro retornado pelo servidor ou uma mensagem genérica
            setError(err.response?.data?.error || 'Erro ao fazer login');
            console.log('Erro ao fazer login', err)
        }
    };

    return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#434343] flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md" >
            <h1 className="text-2xl font-bold text-center  text-gray-800" >
                Login de usuario
            </h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-red-500 text-center">{success}</p>}
            <form  onSubmit={handleLogin}className="space-y-4">
                <div>
                    <label htmlFor="email" className=" text-gray-600  lock text-sm font-medium focus:ring-blue-500 focus:border-blue-500">Email</label>
                    <input 
                    id="email"
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-gray-500 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Digite seu Email"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="senha" className=" text-gray-600  lock text-sm font-medium focus:ring-blue-500 focus:border-blue-500">Senha</label>
                    <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="text-gray-500 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                     />
                </div>
                <Button color="bg-green-500" text="Entrar" className="w-full"/>
            </form>
            <p className="text-center text-sm text-gray-700 mt-4">
                
                Ainda não tem uma conta? <Link href={"/Resgister"}>Resgistre-se agora!</Link>


            </p>
        </div>
    </div>
    )

}