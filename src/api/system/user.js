import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/user/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function resetPassword(id) {
  return request({
    url: '/user/resetPassword/' + id,
    method: 'post'
  })
}

export function switchEnabled(id) {
  return request({
    url: '/user/switchEnabled/' + id,
    method: 'post'
  })
}
