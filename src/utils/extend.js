import store from '@/store'
import { ElMessage as Message } from 'element-plus'
import { _zpmessage } from '@/utils/message'

export function blobToBase64(blob) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export function isImage(name) {
  const nameSuffix = name.substring(name.lastIndexOf('.') + 1)
  return !!nameSuffix.match(/png|jpg|jpeg|bmp|webp|gif|svg|ico/i)
}

export function isDoc(name) {
  const nameSuffix = name.substring(name.lastIndexOf('.') + 1)
  return !!nameSuffix.match(/doc|docx|ppt|pptx|pdf|txt|csv/i)
}

export function isCode(name) {
  const nameSuffix = name.substring(name.lastIndexOf('.') + 1)
  return !!nameSuffix.match(
    /js|py|java|ts|go|cpp|h|c|md|php|json|css|html|htm|less|sass|scss|rs|kt|swift|groovy|cs|sh|bash|zsh|bat|sql|xml|rb/i
  )
}

export function isExcel(name) {
  const nameSuffix = name.substring(name.lastIndexOf('.') + 1)
  return !!nameSuffix.match(/xlsx|xls|numbers/i)
}

export function transferFileSize(size) {
  if (!size) return '0B'
  var num = 1024
  if (size < num) return size + 'B'
  if (size < Math.pow(num, 2)) return Math.ceil((size / num) * 100) / 100 + 'KB'
  if (size < Math.pow(num, 3)) return Math.ceil((size / Math.pow(num, 2)) * 100) / 100 + 'MB'
  if (size < Math.pow(num, 4)) return Math.ceil((size / Math.pow(num, 3)) * 100) / 100 + 'G'
  return Math.ceil((size / Math.pow(num, 4)) * 100) / 100 + 'T'
}

/* export function getFileIcon(type) {
  if (type === 'xlsx' || type === 'xls' || type === 'numbers') {
    return require('@/assets/image/common/excel.png')
  } else if (type === 'pdf') {
    return require('@/assets/image/common/pdf.png')
  } else if (type.match(/ppt|pptx|key/gim)) {
    return require('@/assets/image/common/ppt.png')
  } else if (type.match(/txt|doc|docx/gim)) {
    return require('@/assets/image/common/wendang.png')
  } else {
    return require('@/assets/image/common/file-default.png')
  }
} */

export function adownload(url) {
  return new Promise((resolve, reject) => {
    try {
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = 'xx'
      a.href = url + '?response-content-type=application/octet-stream'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      resolve()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

export function xhrDownload(url, filename) {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response
          const a = document.createElement('a')
          a.style.display = 'none'
          a.download = filename
          a.href = URL.createObjectURL(blob)
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
      xhr.send()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

export function downloadWithProgress(file, index) {
  console.log(file, index)
  const { url } = file
  const xhr = new XMLHttpRequest()
  store.commit('CloudKnowledge/SET_FILE_UPLOADED', {
    index,
    val: { download: true, xhr }
  })
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = file.wholeName
      a.href = URL.createObjectURL(blob)
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      const percent = parseFloat(((event.loaded / event.total) * 100).toFixed(2))
      store.commit('CloudKnowledge/SET_FILE_UPLOADED', {
        index,
        val: {
          downloadPercent: percent
        }
      })
      if (percent === 100) {
        setTimeout(() => {
          store.commit('CloudKnowledge/SET_FILE_UPLOADED', {
            index,
            val: {
              xhr: null,
              download: false,
              downloadPercent: 0
            }
          })
        }, 800)
      }
    }
  }
  xhr.onerror = function (e) {
    Message('下载失败')
    store.commit('CloudKnowledge/SET_FILE_UPLOADED', {
      index,
      val: {
        xhr: null,
        download: false,
        downloadPercent: 0
      }
    })
  }
  xhr.send()
}

export async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export async function judgeIsDirectory(e) {
  return new Promise((resolve, reject) => {
    const { files, items } = e.dataTransfer
    const lenFiles = files.length
    const lenItems = items.length
    if (items) {
      for (let i = 0; i < lenItems; i++) {
        if (items[i].kind === 'file' && items[i].webkitGetAsEntry().isFile) {
          console.log('这是文件')
        } else {
          console.log('这是文件夹')
          resolve(true)
          break
        }
      }
      resolve(false)
    } else {
      let idx = 0
      for (let i = 0; i < lenFiles; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          console.log('这是文件~')
          idx += 1
          console.log(idx)
          if (idx === lenFiles) {
            resolve(false)
          }
        }
        reader.onerror = () => {
          console.log('这是文件夹~')
          resolve(true)
        }
      }
    }
  })
}

export const createThrottleCallback = callback => {
  let lastClickTime = 0

  return function (...args) {
    // 使用扩展运算符来接收任意数量的参数
    const currentTime = Date.now()
    if (currentTime - lastClickTime < 2000) {
      _zpmessage('清影喘口气，稍后再试～')
      return
    }
    lastClickTime = currentTime
    // eslint-disable-next-line standard/no-callback-literal
    callback(...args) // 使用扩展运算符来传递参数
  }
}

export const scrollToBottom = (selector, ms = 0) => {
  setTimeout(() => {
    const element = document.querySelector(selector)
    if (!element) {
      return
    }

    const scrollHeight = element.scrollHeight

    if (ms) {
      // 使用原生 JavaScript 实现平滑滚动
      const startTime = performance.now()
      const startScrollTop = element.scrollTop

      const animateScroll = currentTime => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / ms, 1)
        const easeOutQuad = progress * (2 - progress) // 缓动函数

        element.scrollTop = startScrollTop + (scrollHeight - startScrollTop) * easeOutQuad

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    } else {
      element.scrollTop = scrollHeight
    }
  }, 50)
}

// 图片网络地址转文件流并获取详细信息
export async function imageUrlToFile(url, filename) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('Canvas to Blob failed'))
              return
            }

            const file = new File([blob], filename || 'image.png', { type: 'image/png' })
            resolve({
              file,
              width: img.width,
              height: img.height
            })
          },
          'image/png',
          0.95
        )
      } catch (error) {
        reject(new Error('Failed to process image: ' + error.message))
      }
    }

    img.onerror = () => {
      reject(new Error('Image failed to load. Make sure the server supports CORS.'))
    }

    // 转换URL为使用代理的URL
    // const proxyUrl = url.replace('https://sfile.chatglm.cn', '/image-proxy')
    // const urlWithCache = proxyUrl + (proxyUrl.includes('?') ? '&' : '?') + '_t=' + Date.now()
    img.src = url
  })
}
