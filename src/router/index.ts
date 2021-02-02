import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NP from 'nprogress';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/process',
    children: [
      {
        path: '/process',
        name: 'Process',
        component: () => import(/* webpackChunkName: "process" */ '../views/Process.vue'),
      },
      {
        path: '/strategy',
        name: 'Strategy',
        component: () => import(/* webpackChunkName: "strategy" */ '../views/Strategy.vue'),
      },
      {
        path: '/form',
        name: 'Form',
        component: () => import(/* webpackChunkName: "form" */ '../views/Form.vue'),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  NP.start();
  setTimeout(() => {
    NP.done();
    next();
  }, Math.random() * 1000);
});

export default router;
