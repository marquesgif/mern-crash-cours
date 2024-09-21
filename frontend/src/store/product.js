import { create } from 'zustand';

export const useProductStore = create((set) => ({
    products: [],//
    setProducts: ((products) => set({ products })),//

    //Adicionando dados ao banco
    createProduct: async (newProduct) => {
        //Validação dos dados
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return { success: false, message: "Por-favor preencha todos os campos" }
        }
        //Enviando a requisição com os dados
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            }, body: JSON.stringify(newProduct)
        })

        //
        const data = await res.json();
        //Atualizar os dados
        set((state) => ({ products: [...state.products, data.data] }))
        return { success: true, message: "Produto criado com successo" }
    },

    //Listando os Dados do Banco
    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({ products: data.data });
    },

    //Deletar Produto
    deleteProduct: async (pid) => {
        const res = await fetch(`/api/products/${pid}`, {
            method: "DELETE"
        });

        const data = await res.json()
        if (!data.success) return { success: false, message: data.message }


        //Auto Refresh -> atualiza nossa aplicação ao ponto de que não seja necessário atualizar a página para que o produto desapareça
        set(state => ({ products: state.products.filter(product => product._id !== pid) }))
        return { success: true, message: data.message }
    },

    //Atualizar Produto
    updatedProduct: async (pid, updatedProduct) => {
        const res = await fetch(`/api/products/${pid}`, {
            method: "PUT",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(updatedProduct),
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message }

        //Atualizar a interface, sem a necessidade de refresh
        set(state => ({
            products: state.products.map(product => product._id === pid ? data.data : product)
        }));
        return { success: true, message: data.message }
    }
}));