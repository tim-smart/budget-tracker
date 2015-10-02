export default function(maxWidth, file) {
  return new Promise(function(resolve, reject) {
    const img = new Image();
    let blob = new Blob([file.data], {type: file.type})
    let reader = null

    img.src = URL.createObjectURL(blob)

    img.onload = function() {
      let height = img.height
      let width = img.width
      let ratio = maxWidth / width

      if (ratio >= 1) {
        return resolve(img.src)
      }

      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')

      height = height * ratio
      width = width * ratio

      canvas.height = height
      canvas.width = width

      context.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL())
    }
  })
}
