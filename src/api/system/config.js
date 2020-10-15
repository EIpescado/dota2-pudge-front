import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/config',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/config/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/config/' + id,
    method: 'get'
  })
}
