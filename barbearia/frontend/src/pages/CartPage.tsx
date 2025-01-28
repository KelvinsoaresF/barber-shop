'use client'

import { useEffect, useState } from "react"
import api from "@/utils/axios"

export default function CartPage() {
    const[cart, setCart] = useState([]) 
    const[error, setError] = useState('')
    const[success, setSuccess] = useState('')

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/cart/cart')
                setCart(res.data)
            } catch(error) {
                setError('Erro ao carregar carrinho', error)
            }
        }
        fetchCart()
    }, [])

    const removeItem = async (serviceId) => {
        try {
            await api.delete('/cart/cart', { data: { serviceId } })
            setCart(cart.filter((item) => item.serviceId !== serviceId))
            setSuccess('Item removido do carrinho')
        } catch (error) {
            console.error(error);
            setError('Erro ao remover o serviço do carrinho.');
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {cart.length === 0 ? (
            <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
            <div className="grid gap-4">
                {cart.map((item) => (
                    <div key={item.serviceId} className="border rounded-lg p-4 shadow-md">
                         <img 
                            src={`${item.image}`}
                            alt="Imagem do serviço" 
                            className='w-full h-48 object-cover'
                        />
                        <h2 className="text-lg font-semibold">{item.serviceName}</h2>
                        <p className="text-gray-700">Preço: R$ {item.price.toFixed(2)}</p>
                        <button
                            onClick={() => removeItem(item.serviceId)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-600"
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
    )
}