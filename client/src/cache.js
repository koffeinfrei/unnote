export async function getBlob(name) {
  const cache = await caches.open('media')

  const image = await cache.match(name)
  if (image) {
    const blob = await image.blob()
    await cache.delete(name)

    return blob
  }
}

export async function getJson(name) {
  const cache = await caches.open('media')

  const data = await cache.match(name)
  if (data) {
    const json = await data.json()
    await cache.delete(name)

    return json
  }
}
