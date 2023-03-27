export async function getBlob(name) {
  const keys = await caches.keys()
  const mediaCache = await caches.open(
    keys.filter((key) => key.startsWith('media'))[0],
  )

  const image = await mediaCache.match(name)
  if (image) {
    const blob = await image.blob()
    await mediaCache.delete(name)

    return blob
  }
}
