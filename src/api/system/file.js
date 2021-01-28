import request from '@/utils/request'
import fileRequest from '@/utils/fileRequest'
import { Message } from 'element-ui'
import store from '@/store'

export function list(data) {
  return request({
    url: '/file',
    method: 'get',
    params: data
  })
}

export function getEntityFiles(entityId) {
  return request({
    url: '/file/' + entityId,
    method: 'get'
  })
}

/**
 * 上传文件
 * @param {number} fileTag 文件标识, 用途, 详见字典system_file_tag
 * @param {string} mimeType
 * @param {formData} formData 文件
 * @param {fun} uploadProgress 进度函数
 */
export function upload(fileTag, mimeType, formData, uploadProgress) {
  return request({
    url: '/file/upload',
    method: 'post',
    params: { fileTag: fileTag, mimeType: mimeType },
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: uploadProgress
  })
}

export function download(fileId) {
  return fileRequest({
    url: '/file/download/' + fileId,
    method: 'get',
    responseType: 'blob'
  }).then(res => {
    downloadBackCommon(res)
  }).catch(error => {
    console.log(error)
  })
}

export function downloadZip(fileIds) {
  return fileRequest({
    url: '/file/downloadZip',
    method: 'post',
    data: fileIds,
    responseType: 'blob'
  }).then(res => {
    downloadBackCommon(res)
  }).catch(error => {
    console.log(error)
  })
}

export function downloadBackCommon(res) {
  // 后台返回错误
  if (res.data.type.indexOf('json') !== -1) {
    const reader = new FileReader()
    reader.onload = e => {
      const backRes = JSON.parse(e.target.result)
      if (backRes.code === '0') {
        Message({
          message: backRes.message || '文件不存在或已损坏',
          type: 'error',
          duration: 3000
        })
      } else {
        Message({
          message: backRes.message || 'Error',
          type: 'error',
          duration: 3000
        })
        // 登录过期
        if (backRes.code === '10004') {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        }
      }
    }
    reader.readAsText(res.data)
  } else {
    Message({
      message: '文件开始下载,请耐心等待!',
      type: 'success',
      duration: 3000
    })
    const disposition = res.headers['content-disposition']
    let fileName = disposition.substring(disposition.indexOf('=') + 1)
    fileName = decodeURIComponent(fileName)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = window.URL.createObjectURL(new Blob([res.data]))
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }
}

export function batchGetEntityFileCount(entityIds) {
  return request({
    url: '/file/batchGetEntityFileCount',
    method: 'post',
    data: entityIds
  })
}
