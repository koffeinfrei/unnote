class StickyEditorToolbar {
  constructor() {
    this.$toolbar = $('.ql-toolbar');
    this.$editor = $('.ql-container');
    this.$navbar = $('.navbar');
    this.$notesList = $('.notes-list');

    this.toolbarTop = this.$toolbar.offset().top;
    this.navbarHeight = this.$navbar.height();
  }

  enable() {
    $(document).on('scroll', () => this.toggleSticky());

    EventHive.subscribe('hamburger.show', () => this.setUnsticky());
    EventHive.subscribe('hamburger.hide_end', () => this.toggleSticky());

    EventHive.subscribe('search.show', () => this.setUnsticky());
    EventHive.subscribe('search.hide_end', () => this.toggleSticky());
  }

  toggleSticky() {
    const navbarBottom = this.$navbar.offset().top + this.navbarHeight;

    if (this.$notesList.is(':visible')) {
      this.setUnsticky();
    }
    else if (navbarBottom > this.toolbarTop) {
      this.setSticky();
    }
    else {
      this.setUnsticky();
    }
  }

  setSticky() {
    this.$toolbar.addClass('ql-toolbar-fixed');
    this.$editor.css('margin-top', this.$toolbar.outerHeight());
  }

  setUnsticky() {
    this.$toolbar.removeClass('ql-toolbar-fixed');
    this.$editor.css('margin-top', 0);
  }
}

$(function() {
  if (ViewportMode.isMobileMode()) {
    new StickyEditorToolbar().enable();
  }
});
