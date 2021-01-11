import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/file',
    method: 'get',
    params: data
  })
}

/**
 * 上传文件
 * @param {number} fileTag  文件标识, 用途, 详见字典system_file_tag
 * @param {file} file 文件对象方便标识进度
 */
export function upload(fileTag, formData, uploadProgress) {
  return request({
    url: '/file/upload',
    method: 'post',
    params: { fileTag: fileTag },
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: uploadProgress
  })
}
