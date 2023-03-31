self.addEventListener('fetch', (fetchEvent) => {
  if (fetchEvent.request.url.endsWith('/share-target/') && fetchEvent.request.method === 'POST') {
    return fetchEvent.respondWith(
      (async () => {
        const formData = await fetchEvent.request.formData();
        const image = formData.get('image');
        const title = formData.get('title');
        const text = formData.get('text');
        const url = formData.get('url');

        const keys = await caches.keys();
        const mediaCache = await caches.open(keys.filter((key) => key.startsWith('media'))[0]);

        if (image) {
          await mediaCache.put('shared-image', new Response(image));
        } else {
          await mediaCache.put('shared-data', new Response(JSON.stringify({ title, text, url })));
        }
        return Response.redirect('/#/notes?share-target', 303);
      })(),
    );
  }
});
