import config from '~/config/index.js'

// 统一请求封装
const request = async (url, options = {}) => {
  const { method = 'GET', data, headers = {} } = options

  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (data) {
    fetchOptions.body = JSON.stringify(data)
  }

  const res = await $fetch(config.baseURL + url, fetchOptions)
  return res
}

export const get = (url, params) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return request(url + query)
}

export const post = (url, data) => {
  return request(url, { method: 'POST', data })
}

export const put = (url, data) => {
  return request(url, { method: 'PUT', data })
}

export const del = (url) => {
  return request(url, { method: 'DELETE' })
}

export default { get, post, put, del }
