import VueRouter from "vue-router";
import routes from "./routes";
import store from '@/store';

// configure router
const router = new VueRouter({
  mode : 'history',
  routes, // short for routes: routes
  linkExactActiveClass: "active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login') {
    if (store.getters['auth/isLoged'] === true) {
      next('/dashboard');
    }
  }
  next();
});
export default router;
