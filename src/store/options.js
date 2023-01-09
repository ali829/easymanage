import axios from 'axios'
export default {
    namespaced : true,
    state :{
        options : null
    },
    getters : {
        
        getOptions: state => {
            return state.options
          }
    },
    mutations:{
        SET_OPTIONS(state,options){
            state.options = options
        }
    },
    actions : {
        async fetchOptions({commit},product_id){
            const response = await axios.get(`auth/options/${product_id}`)
            commit('SET_OPTIONS',response.data.options)
            
        },
        async destroyOption({dispatch},option_id){
            await axios.delete(`auth/option/${option_id}`)
            dispatch('fetchOptions');
        },
        async NewOption({dispatch},form){
            await axios.post('auth/option',form)
            .catch(()=>{
                Swal.fire(
                    'oops!',
                    'something wnt wrong check your network and try again',
                    'warning'
                )
            })
            dispatch('fetchOptions');
        },
        async updateOption({dispatch},form){
            await axios.put(`auth/option/${form.id}`,form)
            dispatch('fetchOptions');
        }
    },
    modules : {

    }
        
}