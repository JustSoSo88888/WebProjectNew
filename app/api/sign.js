import md5 from 'js-md5'
import config from '~/config/index.js'
import { storage } from '~/utils/index.js'
import { decrypt } from '~/api/AES.js'


const recursiveSort = (params) => {
  if (typeof params !== 'object' || params === null) return params
  if (Array.isArray(params)) return params.map(recursiveSort)
  return Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = recursiveSort(params[key])
    return acc
  }, {})
}

const sorter = (params, sortAsc) => {
  const keys = Object.keys(params).sort()
  if (!sortAsc) keys.reverse()
  return keys.reduce((acc, key) => {
    acc[key] = recursiveSort(params[key])
    return acc
  }, {})
}

export const genSignParams = (timestamp, secretKey, params, sortAsc) => {
  const _params = { ...params }
  delete _params.timestamp
  const sorted = sorter(_params, sortAsc)
  return md5(timestamp + JSON.stringify(sorted) + secretKey).toUpperCase()
}

export const getLocalToken = () => {
  const token = storage.get('token')
  const session = storage.get('session')
  if (token && session) {
    const newSession = md5(token + 'ckeck_session')
    if (session !== newSession) return '00000000'
    return decrypt(token)
  }
  return '00000000'
}

export const getSign = (params = {}) => {
  const { apiKey, secondApikey } = config
  const timestamp = Date.now()
  params.lang = storage.get('locale') ? storage.get('locale') : 'pt';
  params.timestamp = timestamp
  params.token = getLocalToken()
  params.sign = ''
  params.sign = genSignParams(timestamp, apiKey, params, true)
  params.sign = genSignParams(timestamp, secondApikey, params, false)
  params.timestamp = timestamp
  return params
}
