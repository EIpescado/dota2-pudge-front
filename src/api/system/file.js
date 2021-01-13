import request from '@/utils/request'
import fileRequest from '@/utils/fileRequest'

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
  }).catch(error => {
    console.log(error)
  })
}
