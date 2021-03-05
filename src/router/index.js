import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'
import rights from '@/components/rights'
import users from '@/components/users'
import roles from '@/components/roles'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children:[
        {
          path:'/users',
          name: 'users',
          component:users
        },
        {
          path:'/rights',
          name: 'rights',
          component:rights
        },
        {
          path:'/roles',
          name: 'roles',
          component:roles
        },
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  const token=window.localStorage.getItem('token')
  if(to.path==="/login"||token){
    next()
  }
  else{
    next('/login')
  }
})
export default router