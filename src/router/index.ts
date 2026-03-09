import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name : "GameView",
      component: () => import("@/views/GameView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name : "NotFound",
      redirect: {name: 'GameView'},
    }
  ],
})

export default router
