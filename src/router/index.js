import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import Catalog from '../views/CatalogView.vue'

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/exercises', name: 'exercises', component: Catalog },
    { path: '/category/:category', name: 'category', component: Catalog },
    { path: '/exercise/:category/:slug', name: 'exercise', component: () => import('../views/ExerciseView.vue') },
    { path: '/favorites', name: 'favorites', component: Catalog },
    { path: '/history', name: 'history', component: Catalog },
    { path: '/search', name: 'search', component: Catalog },
    { path: '/settings', name: 'settings', component: () => import('../views/SettingsView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: Catalog },
  ],
})
