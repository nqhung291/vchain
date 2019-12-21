import request from '@/utils/request'

export function sendItem(data) {
  return request({
    url: '/itemexchange/create',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain'
    },
    data
  })
}
