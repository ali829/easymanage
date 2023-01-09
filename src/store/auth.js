import axios from 'axios'
export default {
    namespaced : true,
    state :{
        token : null,
        user : null

    },
    getters : {
        isLoged: state => {
            return state.token != null
          },
        getUser: state => {
            return state.user
          },

    },
    mutations:{
        SET_TOKEN(state,token){
            state.token = token
        },
        SET_USER(state,user){
            state.user = user
        }
    },
    actions : {
        async updateProfile({commit},user){
            await axios.post('auth/profile/update',user)
            .catch(err => console.log(err))
        },
        async signin({dispatch}, creadentials){
             await axios.post('auth/signin',creadentials)
            .then(({ data }) => { dispatch('attempt', data.token) })
            .catch(err=>{
                Swal.fire(
                    'oops!',
                    `${err}`,
                    'warning'
                )
            })
        },
         async attempt({commit ,state } ,  token){
            if(token){
                commit("SET_TOKEN",token);
            }
            if(!state.token){
                return
            }
            try{
                const response = await axios.get('auth/me')
                .catch(()=>{
                    Swal.fire(
                        'oops!',
                        `${err}`,
                        'warning'
                    )
                })
                commit('SET_USER',response.data.data)
            }
            catch(e){
                commit('SET_TOKEN',null)
                commit('SET_USER',null)

            }
        },
        signout({commit}){
            return axios.post('auth/signout')
            .then(() => {
                commit('SET_TOKEN',null)
                commit('SET_USER',null)
            })
            .catch(()=>{
                Swal.fire(
                    'oops!',
                    'something wnt wrong check your network and try again',
                    'warning'
                )
            })
        }
    },
    modules : {

    }
        
}