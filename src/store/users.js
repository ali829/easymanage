import axios from 'axios'
export default {
    namespaced : true,
    state :{
        users : null

    },
    getters : {
        getUsers : state => {
            return state.users
        }
    },
    mutations:{
        SET_USERS(state , users){
            state.users = users
        }
    },
    actions : {
        async getUsers({commit}){
            await axios.get('auth/users')
            .then(response => commit("SET_USERS",response.data.users))
            .catch(err => console.log(err))
        },
        async addNewUser(_,form){
            await axios.post('auth/adduser',form)
            .catch(err => console.log(err))
        },
        async destroyeUser(_,id) {
            await axios.delete(`auth/user/${id}`)
            .catch(err => console.log(err))
        },
        async updateUser(_,user){
            await axios.post('auth/profile/update',user)
            .catch(err => console.log(err))
        }
    },
    modules : {

    }
        
}