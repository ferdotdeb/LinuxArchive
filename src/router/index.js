import { createRouter, createWebHistory } from 'vue-router'
import githubBox from '../components/githubBox.vue'

const Directory = () => import('../views/Directory.vue')
const Demo = () => import('../views/Demo.vue')


const routes = [
  { path: '/', redirect: '/github-box' }, // Redirect to root page
  { path: '/github-box', component: githubBox },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
