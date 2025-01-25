'use client'

import '@/app/globals.css'
import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from 'next/navigation';

export default function AddService() {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        image: null,
    })
    const router = useRouter()
    const [previewImage, setPreviewImage] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target 
        console.log(`${name}: ${value}`)
        setFormData({ 
            ...formData, 
            [name]: value   
        })

    }

    // handleClick() {

    // }

    const handleFile = (e) => {
        const file = e.target.files[0]
        console.log(file)
        if (file) {
            const imagePreviewURL = URL.createObjectURL(file)
            setPreviewImage(imagePreviewURL)
            setFormData({
                ...formData,
                image: file
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess('')
        setError('')
        try {

            const data = new FormData()
                data.append('name', formData.name)
                data.append('price', formData.price)
                data.append('image', formData.image)


            const res = await api.post('http://localhost:5000/api/service/services', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            console.log('Resposta do backend:', res.data);
            setSuccess('Serviço criado com sucesso')
            setFormData({ name: '', price: 0, image: null })
            setPreviewImage('')
            router.push('/MenageServices')
        } catch (err) {
            console.error('Erro no backend:', err.response)
            setError(err.response?.data?.error || 'Erro ao criar serviço')
        }
    }



return (
    <main className='flex justify-center items-center h-screen bg-gray-200'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
            <h1 className='text-xl font-bold mb-4'>Adicionar novo serviço</h1>
            {success && <p className='text-green-500 text-sm mb-2'>{success}</p>}
            {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="name" className='block font-medium'>Nome do serviço</label>
                <input 
                type="text" 
                id="name"
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full border border-gray-300 rounded-lg px-3 py-2x'
                />
                <label htmlFor="price" className='block font-medium mb-1'>Preço R$</label>
                <input 
                type="text"
                id='price'
                name='price'
                value={formData.price}
                onChange={handleChange}
                required
                className='w-full border border-gray-300 rounded-lg px-3 py-2'
                placeholder='R$:'
                />
                <label htmlFor="image" className='block font-medium mb-1'>Imagem do serviço</label>
                <input 
                type="file"
                id='image'
                name='image'
                accept="image/*"
                onChange={handleFile}
                required
                className='w-full border border-gray-300 rounded-lg px-3 py-2'
                />

                {previewImage && (
                    <div className='mt-2 border rounded-md overflow-hidden'>
                        <p className='font-medium mb-2'>Pré visualização</p>
                        <img 
                        src={previewImage} 
                        alt="Imagem do serviço" 
                        className='w-full mt-2 rounded-md bg-gray-300 mt-2' 
                        />

                    </div>  
                )}

                
                

                <button
                type='submit'
                className='w-full bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-blue-600'
                >
                    Adicionar serviço
                </button>
            </form>
        </div>
    </main>
)
}