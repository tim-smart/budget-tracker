import 'blueimp-load-image/js/load-image.all.min'

export default function(file, maxWidth = 800) {
  return new Promise(function(resolve, reject) {
    loadImage.parseMetaData(file, function(data) {
      let orientation = null
      if (data.exif && data.exif.get) {
        orientation = data.exif.get('Orientation')
      }

      loadImage(
        file,
        imageLoaded,
        {
          canvas: true,
          maxWidth: maxWidth,
          orientation: orientation
        }
      )
    })

    function imageLoaded(canvas) {
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
  })
}
