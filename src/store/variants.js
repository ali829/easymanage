import axios from 'axios'
export default {
    namespaced : true,
    state :{
        variants : null
    },
    getters : {
        getVariants: state => {
            return state.variants
          }
    },
    mutations:{
        SET_VARIANTS(state,variants){
            state.variants = variants
        }
    },
    actions : {
        newVariant({dispatch},form){
            axios.post('auth/variant',form)
        },
        async getProductVariants({commit},product_id){
            const response = await axios.get(`auth/getvariants/${product_id}`)
            commit('SET_VARIANTS',response.data.data)
        },
        destroyVariant(_ , variant_id){
            axios.delete(`auth/variant/${variant_id}`)
        },
        UpdateVariant({dispatch},variant){
            axios.put(`auth/variant/${variant.id}`,variant)
            .catch(err=>{
                console.log(err)
            })
        },
    },
    modules : {

    }
        
}