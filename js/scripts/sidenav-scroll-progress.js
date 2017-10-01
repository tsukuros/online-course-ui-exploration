;(function($) {

  function SideNavScrollProgress(el) {
    this.$el = $(el);
    this.$subnav = this.$el.find('.sub-nav');
    this.$sectionIndicators = this.$el.find('.sub-nav .nav-link');
    this.$scrollProgressBar = this.$el.find('.scroll-progress .progress-bar');
    this.$scrollingArea = $('body');
    this.$scrollingAreaHeight = this.$scrollingArea.height();
    this.$scrollingAreaOffsetTop = this.$scrollingArea.offset().top;
    this.$win = $(window);
    this.$container = $('.content-wrapper').first();
    this.trackScrollProgressByTop = true;
    this.reachedBottomOnce = false;
    
    this.init();

    this.$win
      .on('scroll', this.onScroll.bind(this))
      .on('resize', this.onResize.bind(this))
      .scroll()
      .resize();
  }

  SideNavScrollProgress.prototype = {
    constructor: SideNavScrollProgress,
    init: function(){
      setTimeout(this.setPositions.bind(this), 500);
      this.initScrollSpy();
      this.setReadSections();
    },
    initScrollSpy: function(){
      $('body').scrollspy({
        target: '#sidenav',
      });
      this.$win.on('activate.bs.scrollspy', function(e, o){
        $('[href="'+o.relatedTarget+'"]')
          .addClass('read')
          .removeClass('text-bold');
      })
    },
    onScroll: function(e) {
      var scrolledBottom = this.$win.scrollTop() + this.$win.height();
      var scrolledPx = scrolledBottom - this.$scrollingAreaOffsetTop;
      if (scrolledPx < 0) return;
      var scrolledPercent = (scrolledPx /  this.$scrollingAreaHeight) * 100;
      if (scrolledPercent >= 100) {
        scrolledPercent = 100;
        this.reachedBottomOnce = true;
        this.$subnav.addClass('complete');
      } else {
        this.$subnav.removeClass('complete');
      }
      if (this.reachedBottomOnce) this.fillUpCurrentDiamond();
      this.$scrollProgressBar.css({ height: scrolledPercent + '%' })
    },
    onResize: function(e) {
      var offset = this.$container.offset();
      var gutter = 40;
      var sideNavWidth = this.$el.width();
      if (offset.left > sideNavWidth + gutter) {
        this.$el.css({ left: offset.left - sideNavWidth - gutter });
      } else {
        this.$el.css({ left: '' });
      }
    },
    setPositions: function(){
      this.winHeight = this.$win.height();
      this.$sectionIndicators.each(function(i, el){
        var sectionId = el.getAttribute('href');
        var offsetTopPx = $(sectionId).offset().top;

        var offsetTopPercent = ((offsetTopPx + this.winHeight) / this.$scrollingAreaHeight) * 100;
        offsetTopPercent = offsetTopPercent > 100 ? 100 : offsetTopPercent;
        $(el).css({ top: 'calc(' + offsetTopPercent + '% - 10px)' });
      }.bind(this));
    },
    setReadSections: function(){
      var currentSection = this.$el.find('.root-nav > .nav-link.active')
      this.readSections = localStorage.getItem('sections');
      if (!this.readSections) {
        this.readSections = [currentSection.data('section')];
        localStorage.setItem('sections', JSON.stringify(this.readSections))
      } else {
        this.readSections = JSON.parse(this.readSections);
        this.readSections.forEach(function(sectionId) {
          $('[data-section="'+sectionId+'"]').addClass('read');
        });
      }
    },
    fillUpCurrentDiamond: function() {
      var currentActiveSection = $('.root-nav > .nav-link.active').addClass('read');
      var dataSection = currentActiveSection.data('section');
      if (this.readSections.indexOf(dataSection) == -1) {
        this.readSections.push(dataSection);
        localStorage.setItem('sections', JSON.stringify(this.readSections))
      }
    }
  }

  window.SideNavScrollProgress = SideNavScrollProgress;

  $.fn.sideNavScrollProgress = function(option) {
    return this.each(function() {
      var $this = $(this),
      data = $this.data('t.sideNavScrollProgress');

      if (!data) $this.data('t.sideNavScrollProgress', ( data = new SideNavScrollProgress(this) ));

      if (typeof option === 'string') data[option]();
    });
  };

  $('.sidenav').sideNavScrollProgress();

})(jQuery);
