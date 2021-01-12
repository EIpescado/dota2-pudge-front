import request from '@/utils/request'

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
