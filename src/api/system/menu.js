import request from '@/utils/request'

export function tree() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

export function wholeTree() {
  return request({
    url: '/menu/wholeTree',
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function deleteNode(data) {
  return request({
    url: '/menu/delete',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/menu/' + id,
    method: 'post',
    data
  })
}
