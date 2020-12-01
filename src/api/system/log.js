import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/log',
    method: 'get',
    params: data
  })
}
