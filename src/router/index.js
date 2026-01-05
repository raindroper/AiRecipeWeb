import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layout/AppLayout.vue'
import Home from '../views/home/Home.vue'
import CreateRecipeView from '../views/CreateRecipeView.vue'
import UserProfileView from '../views/UserProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'publish',
          name: 'publish',
          component: CreateRecipeView,
        },
        {
          path: 'profile',
          name: 'profile',
          component: UserProfileView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/home/Home.vue'), // Placeholder using dynamic import, or create a dummy file?
      // User said "component can use dynamic import placeholder". I'll point to Home for now or just a dummy function.
      // Better to point to a real file so it doesn't crash if visited.
    },
    // Keep the detail route accessible if needed, but user didn't explicitly ask for it in this step.
    // However, Home.vue links to /recipe/:id. If I remove it, navigation breaks.
    // The user said "Last, please help me configure... to link the components above together."
    // Home.vue uses /recipe/:id. I should probably keep it or add it back if I want the app to be fully functional.
    // But the user's requirement list 2 only mentioned AppLayout children and /login.
    // I will add /recipe/:id back because it's necessary for the Home component "above" to work properly.
    {
      path: '/recipe/:id',
      name: 'recipe-detail',
      component: () => import('../views/RecipeDetailView.vue'),
    },
  ],
})

export default router
