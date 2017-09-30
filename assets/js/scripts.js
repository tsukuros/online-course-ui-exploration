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
    this.$container = $('.container').first();
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
      if (scrolledPercent > 100) {
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

;(function($) {

  function ShrinkableStickyHeroVideo(el) {
    this.$el = $(el);
    this.$video = $('#hero-video');
    this.$videoContainer = $('#hero-video-container');
    this.$heroSection = $('#hero');
    this.$stickyColumn = $('.sticky-column');
    this.$header = $('.navbar.fixed-top');
    this.$win = $(window);

    this.updateDimensionsAndPositions();
    this.$win
      .on('scroll', this.onScroll.bind(this))
      .on('resize', this.onResize.bind(this))
      .scroll();
  }

  ShrinkableStickyHeroVideo.prototype = {
    constructor: ShrinkableStickyHeroVideo,
    onScroll: function(e) {
      if (this.$win.width() < 768) return;
      var st = $(e.currentTarget).scrollTop();
      var videoHeight = this.$video.outerHeight();
      if(st > 0) {
        this.$videoContainer.addClass('container');
        this.$video.addClass('in');
        var shrunkWidth = this.containerWidth - st;
        // set video width
        if (shrunkWidth > this.stickyColumnWidth) {
          this.$video.css({
            width: shrunkWidth,
          });
        } else {
          this.$video.css({
            width: this.stickyColumnWidth,
          });
        }
        // pull video up if hit the bottom of the section
        if (st + videoHeight > this.stickyColumnBottom) {
          this.$video.css({ top: (this.stickyColumnBottom + this.headerHeight) - (st + this.headerHeight + videoHeight)})
        } else {
          this.$video.css({ top: '' });
        }
      } else {
        this.$videoContainer.removeClass('container');
        this.$video.removeClass('in');
        this.$video.css({width: 'auto'});
      }
    },
    updateDimensionsAndPositions: function() {
      this.videoHeight = this.$video.outerHeight();
      this.stickyColumnWidth = this.$stickyColumn.width();
      this.stickyColumnHeight = this.$stickyColumn.height();
      this.stickyColumnBottom = this.$stickyColumn.offset().top + this.stickyColumnHeight;
      this.containerWidth = $('.container').first().width();
      this.bbox = this.$video[0].getBoundingClientRect();
      this.windowWidth = this.$win.width();
      this.videoRight = this.windowWidth - this.bbox.right;
      this.headerHeight = this.$header.outerHeight();

      this.$video.css({right: this.videoRight});
      this.$heroSection.css({minHeight: this.videoHeight});
    },
    onResize: function(e) {
      if (this.$win.width() > 767) {
        this.updateDimensionsAndPositions();
      }
    }
  }

  window.ShrinkableStickyHeroVideo = ShrinkableStickyHeroVideo;

  $.fn.shrinkableStickyHeroVideo = function(option) {
    return this.each(function() {
      var $this = $(this),
      data = $this.data('t.shrinkableStickyHeroVideo');

      if (!data) $this.data('t.shrinkableStickyHeroVideo', ( data = new ShrinkableStickyHeroVideo(this) ));

      if (typeof option === 'string') data[option]();
    });
  };

  $('#hero').shrinkableStickyHeroVideo();

})(jQuery);
