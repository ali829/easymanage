import axios from 'axios'
export default {
    namespaced : true,
    state :{
       products : [],
       categories : [],
       current_pro :null
    },
    getters : {
        getProducts : state =>{
            return state.products
        },
        getCategories : state =>{
            return state.categories
        },
        getCurentPro : state =>{
            return state.current_pro
        }
    },
    mutations:{
        SET_PRODUCTS(state,products){
            state.products=products
        },
        SET_CATEGORIES(state,categories){
            state.categories=categories
        },
        SET_PRO(state,pro){
            state.current_pro = pro
        },
    },
    actions : {
        async fetchProducts({dispatch,commit}){
            const response = await axios.get('auth/products')
            commit('SET_PRODUCTS',response.data.products)
            dispatch('fetchCategories')
        },
        async destroyProduct({dispatch},product_id){
            await axios.delete(`auth/product/${product_id}`)
            dispatch('fetchProducts');
        },
        async fetchCategories({commit}){
            const response = await axios.get('auth/allcategories')
            commit('SET_CATEGORIES',response.data.categories)
        },
        newProduct({dispatch},form){
            axios.post('auth/product',form)
            dispatch('fetchProducts')
        },
        async fetchPro({commit},id){
            await axios.get(`auth/product/${id}`)
            .then(response => commit('SET_PRO',response.data.data))
            .catch(()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  })
            })
            
        },
        async updateProduct({commit}, product){
            await axios.put(`auth/subproducts/${product.id}`,product)
            .then(response=>{
                commit('SET_PRO',response.data.data)
            })
        },
    },
    modules : {

    }
        
}