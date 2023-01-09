import axios from 'axios'
export default {
    namespaced : true,
    state :{
        categories : null,
        sub_categories : null,
        sub_products : null,
        current_cat : null,
        allcategories : null
    },
    getters : {
        
        getCategories: state => {
            return state.categories
        },
        getAllCategories: state => {
            return state.allcategories
        },
        getSubCategories: state => {
            return state.sub_categories
        },
        getSubProducts: state => {
            return state.sub_products
        },
        getCurentCat : state =>{
            return state.current_cat
        }
    },
    mutations:{
        SET_CATEGORIES(state,categories){
            state.categories = categories
        },
        SET_ALL_CATEGORIES(state,categories){
            state.allcategories = categories
        },
        SET_CAT(state,cat){
            state.current_cat = cat
        },
        SET_SUB_CATEGORIES(state,sub_categories){
            state.sub_categories = sub_categories
        },
        SET_SUB_PRODUCTS(state,sub_products){
            state.sub_products = sub_products
        }
    },
    actions : {
        async fetchCategories({commit}){
            const response = await axios.get('auth/categories')
             
            commit('SET_CATEGORIES',response.data.categories)
            
        },
        async allcategories({commit}){
            const response = await axios.get('auth/allcategories')
            commit('SET_ALL_CATEGORIES',response.data.categories)
            
        },
        async destroyCategory({dispatch},category_id){
            await axios.delete(`auth/category/${category_id}`)
            dispatch('fetchCategories');
        },
        async NewCategory({dispatch},form){
            await axios.post('auth/category',form)
            dispatch('fetchCategories');
        },
        async updateCategory({dispatch},form){
            await axios.put(`auth/category/${form.id}`,form)
            dispatch('fetchCategories');
        },
        async fetchSubCategories({commit},id){
            const response = await axios.get(`auth/subcategories/${id}`)
            commit('SET_SUB_CATEGORIES',response.data.subcategories)
        },
        async fetchSubProducts({commit},id){
            const response = await axios.get(`auth/subproducts/${id}`)
            commit('SET_SUB_PRODUCTS',response.data.subproducts)
        },
        async addsubproduct({dispatch},form){
            await axios.post('auth/subproducts/addproduct',form)
            if(form.category_id){
                dispatch('fetchSubProducts',form.category_id)
            }
        },
        removeProduct({dispatch}, product){
            axios.delete(`auth/subproducts/${product.id}`)
            dispatch('fetchSubProducts',product.category_id)
        },
        updateProduct({dispatch}, product){
            axios.put(`auth/subproducts/${product.id}`,product)
            if(product.category_id){
                dispatch('fetchSubProducts',product.category_id)
            }
        },
        async fetchCat({commit},id){
            await axios.get(`auth/category/${id}`)
            .then(response => commit('SET_CAT',response.data.data))
            .catch(()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  })
            })
            
        },
    },
    modules : {

    }
        
}