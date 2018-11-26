import $ from 'jquery';

export function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 300)
}
