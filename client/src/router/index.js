import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminFormView from '../views/AdminFormView.vue';
import StudentFormView from '../views/StudentFormView.vue';
import UserFormView from '../views/UserFormView.vue';
import UserResultView from '../views/UserResultView.vue';
import NotFoundView from '../views/NotFoundView.vue'; 

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin-form',
    name: 'adminForm',
    component: AdminFormView
  },
  {
    path: '/student-form',
    name: 'studentForm',
    component: StudentFormView
  },
  {
    path: '/user-form',
    name: 'userForm',
    component: UserFormView
  },
  {
    path: '/user-result',
    name: 'userResult',
    component: UserResultView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;