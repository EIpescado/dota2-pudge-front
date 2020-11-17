import request from '@/utils/request'

export function listDictType(data) {
  return request({
    url: '/dictType',
    method: 'get',
    params: data
  })
}

export function getDictType(id) {
  return request({
    url: '/dictType/' + id,
    method: 'get'
  })
}

export function createDictType(data) {
  return request({
    url: '/dictType',
    method: 'post',
    data
  })
}

export function updateDictType(id, data) {
  return request({
    url: '/dictType/' + id,
    method: 'post',
    data
  })
}

export function deleteDictType(id) {
  return request({
    url: '/dictType/delete/' + id,
    method: 'post'
  })
}

export function list(data) {
  return request({
    url: '/dict',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/dict/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/dict',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/dict/' + id,
    method: 'post',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: '/dict/delete/' + id,
    method: 'post'
  })
}

export function select(dictType) {
  return request({
    url: '/dict/select?dictType=' + dictType,
    method: 'get'
  })
}
