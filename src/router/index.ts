import {
  createRouter,
  createWebHistory,
  // createWebHashHistory,
} from "vue-router";

import { asyncRouterMap, constantRouterMap } from "@/config";

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes: [...constantRouterMap, ...asyncRouterMap],
});

export default router;
