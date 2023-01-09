<template>
  <div class="wrapper">
    <div data="vue" class="sidebar ps">
   <div class="sidebar-wrapper ps">
      <div class="logo"><a href="http://www.creative-tim.com" class="simple-text logo-mini"><img src="https://demos.creative-tim.com/vue-black-dashboard-pro/img/icon-vue.png" alt="app-logo"></a><a href="http://www.creative-tim.com" class="simple-text logo-normal"> Creative Tim </a></div>
      <ul class="nav">
         <li class="router-link-exact-active active">
            <a href="/dashboard" aria-current="page" class="router-link-exact-active active">
               <i class="tim-icons icon-chart-pie-36"></i>
               <p>Dashboard</p>
            </a>
         </li>
         <li to="/" tag="li" class="">
            <a data-toggle="collapse" class="sidebar-menu-item" @click="dropIt">
               <i class="tim-icons icon-vector"></i>
               <p>inventory<b class="caret"></b></p>
            </a>
            <div class="collapse show" :style="dropDowmnStyle">
               <ul class="nav">
                 <li>
                    <router-link to="/categories"><span class="sidebar-mini-icon"><i class="tim-icons icon-vector"></i></span><span class="sidebar-normal">{{$t('sidebar.categories')}}</span></router-link>
                 </li>
                  <li class="">
                     <router-link to="/products"><span class="sidebar-mini-icon"><i class="tim-icons icon-molecule-40"></i></span><span class="sidebar-normal">{{$t('sidebar.products')}}</span></router-link>
                  </li>
               </ul>
            </div>
         </li>
        
        <li class="">
            <a href="/users" class="">
               <i class="tim-icons icon-single-02"></i>
               <p>users</p>
            </a>
         </li>
         
         <li class="">
            <a href="/calendar" class="">
               <i class="tim-icons icon-time-alarm"></i>
               <p>Calendar</p>
            </a>
         </li>
      </ul>
   </div>
</div>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  data(){
    return {
      isDropped: false,
      dropDowmnStyle : 'display : none;'
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    dropIt() {
      this.isDropped = !this.isDropped
      if(this.isDropped){
        this.dropDowmnStyle = ''
        this.dropDowmnStyle = 'animation-fill-mode: both; animation-timing-function: ease-out;'
      }
      else{
        this.dropDowmnStyle = ''
        this.dropDowmnStyle = 'display: none;'
      }
    }
  },
  computed : {
  }
};
</script>

