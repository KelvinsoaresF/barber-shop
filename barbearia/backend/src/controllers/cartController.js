export const addToCart = async (req, res) => {
    
    try {
        const { serviceId } = req.body
        const userId = req.user.id

        console.log("Adicionando ao carrinho:", { serviceId, userId });

        if (!req.session.cart) {
            req.session.cart = []
        }

        const isInCart = req.session.cart.find(item => item.serviceId === serviceId)
        if (isInCart) {
            return res.status(400).json({ message: 'Serviço ja adicionado no carrinho' })
        }

        req.session.cart.push({ serviceId, userId })
        console.log("Carrinho atualizado:", req.session.cart);

        res.status(201).json({message:'Serviço adicionado ao carrinho', cart: req.session.cart })
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao adicionar serviço ao carrinho' })
    }
} 

export const getCartItems = async (req, res) => {
    try {
        console.log("Requisição chegou ao backend!")

        const cart = req.session.cart || []

        console.log("Sessão atual:", req.session);

        // Log do conteúdo do carrinho
        console.log("Carrinho na sessão:", cart);


        res.status(200).json(cart)
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar items no carrinho' })
    }
}

export const removeToCart = async (req, res) => {
    try {
        const { serviceId } = req.body

        if (!req.session.cart) {
            return res.status(400).json({ message: 'Carrinho vazio' })
        }

        req.session.cart = req.session.cart.filter(items => items.serviceId !== serviceId)
        res.status(200).json({ message: 'Serviço removido do carrinho', cart: req.session.cart })
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao remover serviço do carrinho' })
    }
}