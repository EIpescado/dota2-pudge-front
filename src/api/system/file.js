import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/file',
    method: 'get',
    params: data
  })
}
