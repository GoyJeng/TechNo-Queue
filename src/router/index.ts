import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Today from '../views/Today.vue'
import Calendar from '../views/Calendar.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      component: Login,
    },

    {
      path: '/today',
      component: Today,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/calendar',
      component: Calendar,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

export default router