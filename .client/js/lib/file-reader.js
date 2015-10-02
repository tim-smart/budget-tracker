export default function(file, done) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()

    const ret = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModifiedDate,
      data: null
    }

    reader.onload = function() {
      ret.data = new Uint8Array(reader.result)
      resolve(ret)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
    reader.readAsArrayBuffer(file)
  })
}
