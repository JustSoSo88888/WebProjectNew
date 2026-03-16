// 全局路由守卫（每个路由都会执行，文件名加 .global 后缀）
export default defineNuxtRouteMiddleware((to, from) => {
  // 获取 token（根据实际存储方式调整）
  const token = useCookie('token')

  // 白名单：不需要登录的页面
  const whiteList = ['/login/login', '/login/register']

  if (whiteList.includes(to.path)) {
    // 已登录访问登录页，跳回首页
    if (token.value) {
      return navigateTo('/')
    }
    return
  }

  // 未登录跳转登录页
  if (!token.value) {
    return navigateTo('/login/login')
  }
})
