import { storage } from '~/utils/index'

export default defineNuxtRouteMiddleware((to) => {
  // SSR 阶段跳过，localStorage 只在客户端可用
  if (import.meta.server) return

  const token = storage.get('token')
  
  if (to.name == 'login-login' || to.name == 'login-register') {
    if (token) return navigateTo('/')
    return
  }

  if (!token) return navigateTo('/login/login')
})