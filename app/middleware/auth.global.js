import { storage } from '~/utils/index'

export default defineNuxtRouteMiddleware((to) => {
  // SSR 阶段跳过，localStorage 只在客户端可用
  if (import.meta.server) return

  const token = storage.get('token')
  const whiteList = ['/login/login']

  if (to.path === '/login/register', '/login/register') {
    if (token) return navigateTo('/')
    return
  }

  if (whiteList.includes(to.path)) {
    if (token) return navigateTo('/')
    return
  }

  if (!token) return navigateTo('/login/login')
})