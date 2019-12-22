import request from '@/utils/request'

export function sendItem(data) {
  return request({
    url: '/itemexchange2/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function elasticQuery(data) {
  return request({
    url: '/itemexchange2/elasticsearch',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
