// 项目基础配置
const config = {
  debug: true,//是否处于调试阶段
  // 项目名称
  projectName: 'NovaTravel',
  //正式api
  baseUrl: '',
  //测试api
  mockUrl: 'https://puduapi.superproject.top/api',
  frontUrl: typeof window !== 'undefined' ? window.location.origin : '',//本地地址
  apiKey: 'SocgBG7E5uSYS0N9yiEyIvIO8cZf9Dpk',//签名Key
  secondApikey: 'LH7BhZKuFMAMoBoRu3eM3SMtUzOgoRMw',//签名key1
  // 是否启用 DevTools 检测（禁止用户打开 F12）
  // true: 生产环境生效，检测到 devtools 打开时跳转空白页
  // false: 关闭检测（开发调试时设为 false）
  enableDevtoolsDetector: false,
}

export default config
