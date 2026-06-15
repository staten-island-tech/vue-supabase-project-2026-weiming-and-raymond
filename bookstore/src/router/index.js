import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import BooksView from '../views/BooksView.vue'
import Store from '../views/TheyCallItTheStore.vue'
import { supabase } from '@/lib/supabase.js'
import { useToast } from '@/components/composables/useToast.js'
import OrdersView from '@/views/OrdersView.vue'
const toast = useToast()
const history =
  typeof window !== 'undefined' && window.location.protocol === 'file:'
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/books',
      name: 'books',
      component: BooksView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/store',
      name: 'store',
      component: Store,
      meta: { requiresAuth: true },
    },
  ],
})
router.beforeEach(async (to, from, next) => {
  let session = null
  if (supabase) {
    const { data } = await supabase.auth.getSession()
    session = data.session
  }

  if (to.meta.requiresAuth && !session) {
    toast.error('Login before checking books')
    next('/login')
  } else {
    next()
  }
})
export default router
