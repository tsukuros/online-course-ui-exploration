;(function($) {

  function ShrinkableStickyHeroVideo(el) {
    this.$el = $(el);
    this.$video = $('#hero-video');
    this.$videoContainer = $('#hero-video-container');
    this.$heroSection = $('#hero');
    this.$stickyColumn = $('.sticky-column');
    this.$win = $(window);

    this.updateDimensionsAndPositions();
    this.$win
      .on('scroll', this.onScroll.bind(this))
      .on('resize', this.onResize.bind(this));
  }

  ShrinkableStickyHeroVideo.prototype = {
    constructor: ShrinkableStickyHeroVideo,
    onScroll: function(e) {
      var st = $(e.currentTarget).scrollTop();
      if(st > 0) {
        this.$videoContainer.addClass('container');
        this.$video.addClass('in');
        var shrunkWidth = this.containerWidth - st;
        if (shrunkWidth > this.stickyColumnWidth) {
          this.$video.css({
            width: shrunkWidth,
          });
        } else {
          this.$video.css({
            width: this.stickyColumnWidth,
          });
        }
      } else {
        this.$videoContainer.removeClass('container');
        this.$video.removeClass('in');
        this.$video.css({width: 'auto'});
      }
    },
    updateDimensionsAndPositions: function() {
      this.videoHeight = this.$video.height();
      this.stickyColumnWidth = this.$stickyColumn.width();
      this.containerWidth = $('.container').first().width();
      this.bbox = this.$video[0].getBoundingClientRect();
      this.windowWidth = this.$win.width();
      this.videoRight = this.windowWidth - this.bbox.right;

      this.$video.css({right: this.videoRight});
      this.$heroSection.css({minHeight: this.videoHeight});
    },
    onResize: function(e) {
      this.updateDimensionsAndPositions();
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
