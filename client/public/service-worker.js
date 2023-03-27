self.addEventListener('fetch', (fetchEvent) => {
  if (fetchEvent.request.url.endsWith('/share-target/') && fetchEvent.request.method === 'POST') {
    return fetchEvent.respondWith(
      (async () => {
        const formData = await fetchEvent.request.formData();
        const image = formData.get('image');
        const keys = await caches.keys();
        const mediaCache = await caches.open(keys.filter((key) => key.startsWith('media'))[0]);
        await mediaCache.put('shared-image', new Response(image));
        return Response.redirect('/#/notes?share-target', 303);
      })(),
    );
  }
});
