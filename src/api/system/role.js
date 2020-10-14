import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/role',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete/' + id,
    method: 'post'
  })
}

export function create(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/role/' + id,
    method: 'post',
    data
  })
}

export function bindMenuAndButton(roleId, data) {
  return request({
    url: '/role/' + roleId + '/bindMenuAndButton',
    method: 'post',
    data
  })
}

export function singleRoleMenuAndButton(roleId) {
  return request({
    url: '/role/' + roleId + '/singleRoleMenuAndButton',
    method: 'get'
  })
}

export function select() {
  return request({
    url: '/role/select',
    method: 'get'
  })
}
