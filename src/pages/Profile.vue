<template>
  <div class="row">
    <div class="col-md-8">
      <edit-profile-form :model="model">
      </edit-profile-form>
    </div>
    <div class="col-md-4">
      <user-card :model="model"></user-card>
    </div>
  </div>
</template>
<script>
  import EditProfileForm from './Profile/EditProfileForm';
  import UserCard from './Profile/UserCard'
  import {mapGetters , mapActions} from 'vuex'
  export default {
    components: {
      EditProfileForm,
      UserCard
    },
    data() {
      return {
        model: {
          name: '',
          email: '',
          username: '',
          password : '',
          image : ''
        }
      }
    },
    methods : {
      setAuth(){
        let user = this.getUser
        this.model.name =user.name
        this.model.username =user.username
        this.model.email =user.email
        this.model.image = user.image
      }
    },
    computed: {
        ...mapGetters({
            'getUser': 'auth/getUser',
        })
    },
    created(){
      this.setAuth()
    }
  }
</script>
<style>
</style>
