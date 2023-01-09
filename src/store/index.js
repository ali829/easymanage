import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import categories from './categories'
import options from './options'
import products from './products'
import variants from './variants'
import users from './users'
Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
    state :{

    },
    mutations:{

    },
    actions : {

    },
    modules : {
        auth,
        categories,
        options,
        products,
        variants,
        users
    }
})