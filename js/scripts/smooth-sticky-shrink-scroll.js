;(function($) {

  function ShrinkableStickyHeroVideo(el) {
    this.$el = $(el);
    this.$video = $('#hero-video');
    this.$videoContainer = $('#hero-video-container');
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
      this.$el.css({minHeight: this.videoHeight});
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

  $('#intro').shrinkableStickyHeroVideo();

})(jQuery);
