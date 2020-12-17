import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/log',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/log/' + id,
    method: 'get'
  })
}
