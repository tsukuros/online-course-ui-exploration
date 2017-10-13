;(function(win){
  function StickyMap(el) {
    this.$el = $(el);
    this.headerHeight = $('.navbar.fixed-top').outerHeight();
    this.$miniMapContainer = $('.minimap-container');
    this.miniMapOffset = this.$miniMapContainer.offset();
    this.$scrollableArea = $('.sticky-map-scrollable-area');
    this.$win = $(win);

    this.init(el);

    this.$win
      .on('scroll', this.onScroll.bind(this))
      .on('resize', this.onResize.bind(this))
      .resize()
      .scroll();
  }

  StickyMap.prototype = {
    constructor: StickyMap,
    init: function(el){
      var that = this;

      var map = new google.maps.Map(el, {
        zoom: 4,
        center: {lat: 61.7551453, lng: -150.0472705},
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
      });

      var markerInstances = markers.map(function(marker) {
        return new google.maps.Marker({
          position: {lat: marker.lat, lng: marker.lng},
          map: map,
          title: marker.title,
          icon: that.getIcon('\uf041', '#3d91f3'),
        });
      });
      
      $('#map-keys').html(this.renderMapKeys(markers));
    },
    getIcon: function(glyph, color) {
      var canvas, ctx;
      canvas = document.createElement('canvas');
      canvas.width = canvas.height = 20;
      ctx = canvas.getContext('2d');
      if (color) {ctx.fillStyle = color;}
      ctx.font = '20px FontAwesome';
      ctx.fillText(glyph, 0, 16);
      return canvas.toDataURL();
    },
    renderMapKeys: function(markers) {
      return markers.map(function(marker){
        return '<div class="m-t-sm text-xs text-truncate"><i class="fa fa-map-marker m-r-xs" style="color: #85beff;"></i><span>'+marker.title+'</span></div>';
      }).join('');
    },
    onScroll: function(e) {
      if (this.$win.width() < 768) return;
      var st = $(e.currentTarget).scrollTop();
      if (st + this.headerHeight + 20 > this.miniMapOffset.top) {
        this.$miniMapContainer.addClass('in');
      } else {
        this.$miniMapContainer.removeClass('in');
      }
    },
    onResize: function(e) {
      var maxWidth = this.$scrollableArea.width();
      this.$miniMapContainer.css({ maxWidth: maxWidth });
    }
  }

  window.StickyMap = StickyMap;

  $.fn.stickyMap = function(option) {
    return this.each(function() {
      var $this = $(this),
      data = $this.data('t.stickyMap');

      if (!data) $this.data('t.stickyMap', ( data = new StickyMap(this) ));

      if (typeof option === 'string') data[option]();
    });
  };

  $('#sticky-map').stickyMap();

})(window);
