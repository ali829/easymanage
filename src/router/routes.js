import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
import store from '@/store'
// Admin pages
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue");
const Profile = () => import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
const Notifications = () => import(/* webpackChunkName: "common" */"@/pages/Notifications.vue");
const Icons = () => import(/* webpackChunkName: "common" */ "@/pages/Icons.vue");
const Maps = () => import(/* webpackChunkName: "common" */ "@/pages/Maps.vue");
const Login = () => import(/* webpackChunkName: "common" */ "@/pages/Login.vue");
const Typography = () => import(/* webpackChunkName: "common" */ "@/pages/Typography.vue");
const TableList = () => import(/* webpackChunkName: "common" */ "@/pages/TableList.vue");
const Categories = () => import(/* webpackChunkName: "common" */ "@/pages/Categories.vue");
const ShowCategory = () => import(/* webpackChunkName: "common" */ "@/pages/ShowCategory.vue");
const Options = () => import(/* webpackChunkName: "common" */ "@/pages/Options.vue");
const Products = () => import(/* webpackChunkName: "common" */ "@/pages/Products.vue");
const Users = () => import(/* webpackChunkName: "common" */ "@/pages/Users.vue");
const Dipot = () => import(/* webpackChunkName: "common" */ "@/pages/Dipot.vue");
const ShowProduct = () => import(/* webpackChunkName: "common" */ "@/pages/ShowProduct.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: '/dashboard',
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/isLoged']){
        return next({
          name : 'login'
        })
      }
      next()
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "profile",
        name: "profile",
        component: Profile
      },
      {
        path: "users",
        name: "users",
        component: Users
      },
      {
        path: "category/:category_id",
        name: "showCategorie",
        
        component: ShowCategory
      },
      {
        path: "product/:product_id",
        name: "showProduct",
        props : true,
        component: ShowProduct
      },
      {
        path: "products",
        name: "products",
        props : true,
        component: Products
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
      },
      {
        path: "categories",
        name: "categories",
        component: Categories
      },
      {
        path: "options",
        name: "options",
        component: Options
      },
      {
        path: "dipots",
        name: "dipots",
        component: Dipot
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
