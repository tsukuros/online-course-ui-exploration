;(function($) {

  function SideNavScrollProgress(el) {
    this.$el = $(el);
    this.$sectionIndicators = this.$el.find('.sub-nav .nav-link');
    this.$scrollProgressBar = this.$el.find('.scroll-progress .progress-bar');
    this.$scrollingArea = $('body');
    this.$scrollingAreaHeight = this.$scrollingArea.height();
    this.$scrollingAreaOffsetTop = this.$scrollingArea.offset().top;
    this.$win = $(window);
    this.trackScrollProgressByTop = true;
    
    this.init();

    this.$win
      .on('scroll', this.onScroll.bind(this))
      .on('resize', this.onResize.bind(this))
      .scroll();
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
        // console.log('o', o.relatedTarget);
        $('[href="'+o.relatedTarget+'"]').removeClass('text-bold');
      })
    },
    onScroll: function(e) {
      if (this.reachedBottomOnce) return;
      var scrolledBottom = this.$win.scrollTop() + this.$win.height();
      var scrolledPx = scrolledBottom - this.$scrollingAreaOffsetTop;
      if (scrolledPx < 0) return;
      var scrolledPercent = (scrolledPx /  this.$scrollingAreaHeight) * 100;
      if (scrolledPercent > 100) {
        scrolledPercent = 100;
      }
      this.$scrollProgressBar.css({ height: scrolledPercent + '%' })
    },
    onResize: function(e) {
      console.log('onResize');
    },
    setPositions: function(){
      this.winHeight = this.$win.height();
      this.$sectionIndicators.each(function(i, el){
        var sectionId = el.getAttribute('href');
        var offsetTopPx = $(sectionId).offset().top;

        var offsetTopPercent = ((offsetTopPx) / this.$scrollingAreaHeight) * 100;
        $(el).css({ top: 'calc(' + offsetTopPercent + '% - 6px)' });
      }.bind(this));
    },
    setReadSections: function(){
      var currentSection = this.$el.find('.root-nav > .nav-link.active')
      var readSections = localStorage.getItem('sections');
      if (!readSections) {
        localStorage.setItem('sections', JSON.stringify(['section-1']))
      } else {
        readSections = JSON.parse(readSections);
      }
      console.log('readSections', readSections);
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
