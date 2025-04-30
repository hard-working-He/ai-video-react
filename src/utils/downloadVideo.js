// export const downloadTool = async (url, name) => {
//   const a = document.createElement('a')
//   a.download = name
//   a.href = url + '?response-content-type=application/octet-stream'
//   a.click()
//   a.remove()
// }


export const downloadTool = async (url,name) => {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const a = document.createElement('a')
      const url = URL.createObjectURL(blob)
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  };