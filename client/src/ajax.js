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

function performAjax(url, method = 'GET', data) {
  url = setApiHost(url);

  const spinnerId = startSpinner();

  // make request abortable
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = new Promise((resolve, reject) => {
    let options;
    ({ url, options } = setUrlandOptions(url, method, data, signal));

    fetch(url, options)
      .then(response => handleThen(response, resolve, reject))
      .catch((error) => handleCatch(error, reject))
      .finally(() => stopSpinner(spinnerId));
  })

  return { promise, controller };
}

function setApiHost(url) {
  if (!window.API_HOST) {
    return url;
  }

  return `${window.API_HOST}${url}`;
}

function startSpinner() {
  // start the spinner after 500ms
  const timeoutId = setTimeout(() => {
    EventHive.publish('spinner.toggle', { show: true })
  }, 500)

  return timeoutId;
}

function stopSpinner(timeoutId) {
  // stop the spinner
  clearTimeout(timeoutId);
  EventHive.publish('spinner.toggle', { show: false })
}

function setUrlandOptions(url, method, data, signal) {
  const options = getOptions(method, signal);

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

  return { url, options };
}

function getOptions(method, signal) {
  return {
    method,
    signal,
    headers: {
      'Accept': 'application/json'
    }
  };
}

function handleThen(response, resolve, reject) {
  // When using `#ajax` with `await` the promise somehow resolves always
  // instead of failing (calls `then` instead of `catch`).
  if (!response.ok) {
    reject(new AjaxError(response))
  }
  // 204 No Content
  else if (response.ok && response.status === 204) {
    resolve();
  }
  else if (response.ok) {
    response.json().then(json => resolve(json));
  }
  else {
    response.json().then(json => reject(new AjaxError(response, json)));
  }
}

function handleCatch(error, reject) {
  // ignore when the request was aborted
  // (this happens usually when not yet finished request is replaced by a
  // next request)
  if (error instanceof DOMException && error.name === 'AbortError') {
    // no-op
  }
  else {
    reject(error);
  }
}

class AjaxError extends Error {
  constructor(response, responseJson = {}) {
    super(response.message);
    this.name = 'AjaxError';
    this.status = response.status;
    this.responseJson = responseJson;
  }

  toString() {
    return `${this.name}: ${this.message}. ` +
      `Status: ${this.status}.` +
      `ResponseJson: ${JSON.stringify(this.responseJson)}`;
  }
}
