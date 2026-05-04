// 项目基础配置
const config = {
  debug: false,//是否处于调试阶段
  // 项目名称
  projectName: 'NovaTravel',
  //正式api
  baseUrl: 'https://ntapi.novaseoanalytics.com/api',
  //测试api
  mockUrl: 'https://ntapi.xgdlandlink.shop/api',
  frontUrl: typeof window !== 'undefined' ? window.location.origin : '',//本地地址
  apiKey: 'U8cyOAq7NetJYM8tgZyDuIxrHkuMCLxR',//签名Key
  secondApikey: 'elnrwwrfcr3c1imfXKgP9eA2qqnHFOvS',//签名key1
  //默认语言
  defaultLang: 'pt',
  // 是否启用 DevTools 检测（禁止用户打开 F12）
  // true: 生产环境生效，检测到 devtools 打开时跳转空白页
  // false: 关闭检测（开发调试时设为 false）
  enableDevtoolsDetector: true,

  // wss 长连接配置-客服
  socketUrl: 'wss://ntserver.novaseoanalytics.com/ws',
  mockSocketUrl: 'wss://ntservice.xgdlandlink.shop/ws',
}

export default config
