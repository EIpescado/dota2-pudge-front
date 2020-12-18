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

export function changePassword(params) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data: params
  })
}

export function changeMail(params) {
  return request({
    url: '/user/changeMail',
    method: 'post',
    data: params
  })
}

export function sendChangeMailCode(mail) {
  return request({
    url: '/user/sendChangeMailCode?mail=' + mail,
    method: 'get'
  })
}

export function changePhone(params) {
  return request({
    url: '/user/changePhone',
    method: 'post',
    data: params
  })
}

export function sendChangePhoneCode(phone) {
  return request({
    url: '/user/sendChangePhoneCode?phone=' + phone,
    method: 'get'
  })
}

export function userLog(params) {
  return request({
    url: '/user/log',
    method: 'get',
    params: params
  })
}

export function changeAccountInfo(params) {
  return request({
    url: '/user/changeAccountInfo',
    method: 'post',
    data: params
  })
}
