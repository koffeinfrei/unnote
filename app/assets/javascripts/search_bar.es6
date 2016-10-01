$(function() {
  // push down the body content when the search bar is open
  EventHive.subscribe('search.show', () => {
    $('body').addClass('open-search');
  });
  EventHive.subscribe('search.hide', () => {
    $('body').removeClass('open-search');
  });
});
