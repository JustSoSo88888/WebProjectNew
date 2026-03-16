import { get, post } from '~/api/request.js'

// 示例：用户相关接口
export const userApi = {
  // 登录
  login: (data) => post('/api/user/login', data),
  // 获取用户信息
  getInfo: () => get('/api/user/info'),
  // 退出登录
  logout: () => post('/api/user/logout'),
}
