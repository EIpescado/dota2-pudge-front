import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/notice',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/notice',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/notice/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/notice/' + id,
    method: 'get'
  })
}

export function deleteNotice(id) {
  return request({
    url: '/notice/delete/' + id,
    method: 'post'
  })
}
