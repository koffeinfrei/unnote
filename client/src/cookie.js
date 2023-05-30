// https://www.quirksmode.org/js/cookies.html
export function create(name, value, days) {
  let expires
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toGMTString()}`
  }
  else {
    expires = ''
  }

  document.cookie = `${name}=${value}${expires}; path=/`
}

export function read(name) {
  var nameEq = `${name}=`
  var cookies = document.cookie.split(';')

  for(var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEq) === 0) {
      return cookie.substring(nameEq.length, cookie.length)
    }
  }

  return null;
}

export function erase(name) {
  create(name, '', 1)
}
