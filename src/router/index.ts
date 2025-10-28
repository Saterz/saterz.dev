import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PreviousVersions from '@/views/PreviousVersions.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/previous',
      name: 'previous versions',
      component: PreviousVersions,
    },
  ],
})

export default router
