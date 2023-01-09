<template>
  <card>
    <h5 slot="header" class="title">Edit Profile</h5>
    <div class="row">
      <div class="col-md-5 pr-md-1">
        <base-input label="full name"
                  placeholder="full name"
                  v-model="model.name"
                  >
        </base-input>
      </div>
      <div class="col-md-3 px-md-1">
        <base-input label="Username"
                  placeholder="Username"
                  v-model="model.username">
        </base-input>
      </div>
      <div class="col-md-4 pl-md-1">
        <base-input label="Email address"
                  type="email"
                  v-model="model.email"
                  placeholder="mike@email.com">
        </base-input>
      </div>
    </div>
    <div class="row">
        <div class="col-md-3 px-md-1">
          <base-input label="password"
                    placeholder="password"
                    v-model="model.password">
          </base-input>
        </div>
    </div>

    <base-button slot="footer" type="primary" fill @click="this.updateUserProfile">Save</base-button>
  </card>
</template>
<script>
import {mapGetters , mapActions} from 'vuex'
  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    methods : {
      ...mapActions({
            updateProfile: 'auth/updateProfile',
        }),
        updateUserProfile(){
            this.updateProfile(this.model);
        }
    }
  }
</script>
<style>
</style>
