export function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)

    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)

      resolve(image);
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)

      reject();
    }
    image.src = url
  });
}

export async function resize(blob) {
  const image = await blobToImage(blob)

  const MAX_WIDTH = 1200
  const MAX_HEIGHT = 1200

  let width = image.width
  let height = image.height

  if (width > height) {
    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width)
      width = MAX_WIDTH
    }
  } else {
    if (height > MAX_HEIGHT) {
      width = width * (MAX_HEIGHT / height)
      height = MAX_HEIGHT
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.mozImageSmoothingEnabled = false
  ctx.webkitImageSmoothingEnabled = false
  ctx.msImageSmoothingEnabled = false
  ctx.imageSmoothingEnabled = false

  ctx.drawImage(image, 0, 0, width, height)

  const dataUrl = canvas.toDataURL(blob.type)

  return { dataUrl, width, height }
}
