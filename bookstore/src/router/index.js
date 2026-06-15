import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import Store from '../views/TheyCallItTheStore.vue'
import { supabase } from '@/lib/supabase.js'
import { useToast } from '@/composables/useToast.js'
import OrdersView from '@/views/OrdersView.vue'
const toast = useToast();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      meta: { requiresAuth: true }
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
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    toast.error("Login before checking books");
    next('/login')
  } else {
    next()
  }
})
export default router
