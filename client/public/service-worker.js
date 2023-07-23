self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('/share-target/') && event.request.method === 'POST') {
    return event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const image = formData.get('image');
        const title = formData.get('title');
        const text = formData.get('text');
        const url = formData.get('url');

        const keys = await caches.keys();
        const cache = await caches.open('media');

        if (image) {
          await cache.put('shared-image', new Response(image));
        } else {
          await cache.put('shared-data', new Response(JSON.stringify({ title, text, url })));
        }
        return Response.redirect('/#/notes?share-target', 303);
      })(),
    );
  }
});
