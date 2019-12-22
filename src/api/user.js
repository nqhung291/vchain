import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authentication',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
