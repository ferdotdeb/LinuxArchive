import { createRouter, createWebHistory } from 'vue-router'
// import githubBox from '../components/githubBox.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Bienvenido a LinuxArchive',
      requiresAuth: false,
    },
  },
  {
    path: '/git',
    name: 'git',
    component: () => import('@/views/GitView.vue'),
    meta: {
      title: 'Git Commands',
      requiresAuth: false,
    },
  },
  // {
  //   path: '/linuxWizards',
  //   name: 'linuxWizards',
  //   component: () => import('@/views/LinuxWizardsView.vue'),
  //   meta: {
  //     title: 'Linux Wizards',
  //     requiresAuth: false,
  //   },
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
