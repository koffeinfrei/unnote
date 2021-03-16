import EventHive from './EventHive';

export function ajax(url, method, data) {
  return performAjax(url, method, data).promise;
}

export function ajaxWithAbort(url, method, data) {
  return performAjax(url, method, data);
}

export function objectWithNestedKeys(data, nestKey) {
  const newData = {};

  Object.keys(data).forEach(key => {
    newData[`${nestKey}[${key}]`] = data[key];
  });

  return newData;
}

function setApiHost(url) {
  if (!window.API_HOST) {
    return url;
  }

  return `${window.API_HOST}${url}`;
}

function performAjax(url, method = 'GET', data) {
  url = setApiHost(url);

  // start the spinner after 500ms
  const timeoutId = setTimeout(() => {
    EventHive.publish('spinner.toggle', { show: true })
  }, 500)

  // make request abortable
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = new Promise((resolve, reject) => {
    const options = {
      method,
      signal,
      headers: {
        'Accept': 'application/json'
      }
    }

    if (data) {
      // filter out non-values
      data = Object.fromEntries(
        Object.entries(data).filter(([_key, value]) => value !== undefined)
      );

      if (method === 'GET') {
        const params = new URLSearchParams(data);
        url = `${url}?${params}`;
      }
      else {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        options.body = formData;
      }
    }

    fetch(url, options)
      .then(response => {
        // 204 No Content
        if (response.ok && response.status === 204) {
          resolve();
        }
        else if (response.ok) {
          response.json().then(json => resolve(json));
        }
        else {
          response.json().then(json => reject(
            new Error(response.statusText),
            response.status,
            json
          ));
        }
      })
      .catch((error) => {
        // ignore when the request was aborted
        // (this happens usually when not yet finished request is replaced by a
        // next request)
        if (error instanceof DOMException && error.name === 'AbortError') {
          // no-op
        }
        else {
          reject(error);
        }
      })
      .finally(() => {
        // stop the spinner
        clearTimeout(timeoutId);
        EventHive.publish('spinner.toggle', { show: false })
      });
  })

  return { promise, controller };
}
