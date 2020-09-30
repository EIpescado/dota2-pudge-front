import request from '@/utils/request'

export function get(id) {
  return request({
    url: '/button/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/button',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/button/' + id,
    method: 'post',
    data
  })
}
