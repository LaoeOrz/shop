import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'

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
      component: index
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