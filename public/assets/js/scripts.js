window.markers = [
  {
    title: 'Glacier Bay National Park and Preserve',
    description: 'The earliest traces of human occupation at Glacier Bay date to about 10,000 years before the present, with archaeological sites just outside the park dating to that time.[30] Evidence of human activity is scarce, because so much of the area is or was glaciated for much of the period and because advancing glaciers may have scoured all traces of historical occupation from their valleys.',
    srcUrl: 'https://en.wikipedia.org/wiki/Glacier_Bay_National_Park_and_Preserve#Activities',
    lat: 58.665807,
    lng: -136.900215,
  },
  {
    title: 'Wrangell-St. Elias National Park & Preserve',
    description: 'This park includes a large portion of the Saint Elias Mountains, which include most of the highest peaks in the United States and Canada, yet are within 10 miles (16 km) of tidewater, one of the highest reliefs in the world. Wrangell–St. Elias borders on Canada\'s Kluane National Park and Reserve to the east and approaches the U.S. Glacier Bay National Park to the south.',
    srcUrl: 'https://en.wikipedia.org/wiki/Wrangell%E2%80%93St._Elias_National_Park_and_Preserve',
    lat: 61.710445,
    lng: -142.98568,
  },
  {
    title: 'Katmai National Park and Preserve',
    description: 'Text: This park includes as many as 18 individual volcanoes, seven of which have been active since 1900. The most significant volcanic event in history was the eruption of Mount Katmai and Novarupta in June 1912. Novarupta\'s eruption covered a nearby valley with ash. At the same time, the summit of Katmai collapsed into a caldera. As the valley deposits cooled, they emitted steam from fissures and fumaroles, earning the name "Valley of Ten Thousand Smokes."',
    srcUrl: 'https://en.wikipedia.org/wiki/Katmai_National_Park_and_Preserve#Volcanoes',
    lat: 58.597529,
    lng: -154.693729,
  },
  {
    title: 'Denali National Park and Preserve',
    description: 'The word "Denali" means "the high one" in the native Athabaskan language and refers to the mountain itself. The mountain was named after newly elected US president William McKinley in 1897 by local prospector William A. Dickey. The United States government formally adopted the name Mount McKinley after President Wilson signed the bill creating Mount McKinley National Park into effect in 1917, to the displeasure of locals.',
    srcUrl: 'https://en.wikipedia.org/wiki/Denali_National_Park_and_Preserve#Naming_controversy',
    lat: 63.1148,
    lng: -151.192606,
  },
  {
    title: 'Togiak National Wildlife Refuge',
    description: 'The Togiak National Wildlife Refuge is dominated by the Ahklun Mountains in the north and the cold waters of Bristol Bay to the south. The natural forces that have shaped this land range from the violent and powerful to the geologically patient. Earthquakes and volcanoes filled the former role, and their marks can still be found, but it was the gradual advance and retreat of glacial ice that carved many of the physical features of this refuge.',
    srcUrl: 'https://en.wikipedia.org/wiki/Togiak_National_Wildlife_Refuge',
    lat: 59.221712,
    lng: -159.980149,
  },
  {
    title: 'Yukon Delta National Wildlife Refuge',
    description: 'The refuge\'s coastal region bordering the Bering Sea is a rich, productive wildlife habitat supporting one of the largest concentrations of water fowl in the world. More than one million ducks and half a million geese use the area for breeding purposes each year.',
    srcUrl: 'https://en.wikipedia.org/wiki/Yukon_Delta_National_Wildlife_Refuge',
    lat: 61.368856,
    lng: -163.716136,
  },
  {
    title: 'Lake Clark National Park and Preserve',
    description: 'Lake Clark preserves a wide variety of Alaskan landscapes and ecosystems, corresponding to its four main physiographic areas. The coastal sections running along the Cook Inlet from Tuxedni Bay to Chinitna Bay include coastline and marine ecosystems. The mountains of the Alaska, Aleutian and Chigmit Ranges with their glaciers form a second region. On either side of the mountains the valley, lake and foothill areas present a glacially altered landscape.',
    srcUrl: 'https://en.wikipedia.org/wiki/Lake_Clark_National_Park_and_Preserve#Ecology',
    lat: 60.203294,
    lng: -154.319455,
  },
];

;(function(win){

  function HeroMap(el) {
    this.$el = $(el);

    this.init(el);
  }

  HeroMap.prototype = {
    constructor: HeroMap,
    init: function(el){
      var defaultIcon = {
        url: 'assets/images/part-3/bullseye.svg',
        size: new google.maps.Size(62, 62),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(31, 31),
      };

      var map = new google.maps.Map(el, {
        zoom: 6,
        center: {lat: 61.7551453, lng: -150.0472705},
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
      });

      var markerInstances = markers.map(function(marker) {
        return new google.maps.Marker({
          position: {lat: marker.lat, lng: marker.lng},
          map: map,
          title: marker.title,
          icon: defaultIcon,
        });
      });

      var infowindow = new google.maps.InfoWindow({
        content: '',
        maxWidth: 385,
      });

      var that = this;

      markerInstances.forEach(function(markerInstance) {
        markerInstance.addListener('click', function() {
          markerInstances.forEach(function(markerInst) {
            if (markerInstance !== markerInst) markerInst.setIcon(defaultIcon);
          });

          markerInstance.setIcon({
            url: 'assets/images/part-3/active-bullseye.svg',
            size: new google.maps.Size(136, 136),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(68, 68),
          });

          map.panTo(markerInstance.getPosition());

          infowindow.setContent(
            that.getInfoWindowContent(
              that.getMarker(markerInstance.getTitle())
            )
          );
          infowindow.open(map, markerInstance);
        });
      });
    },
    getMarker: function(title){
      return markers.filter(function(m) {
        return m.title === title;
      })[0];
    },
    getInfoWindowContent: function(marker) {
      return '<div id="content" class="p-a-xxs">'+
        '<h3 style="font-size: 16px; margin-bottom: 20px;">'+marker.title+'</h3>'+
        '<p style="font-size: 16px; margin-bottom: 10px;">'+marker.description+'</p>'+
        '<a target="_blank" style="color: #4c97ef; font-size: 14px;" href="'+marker.srcUrl+'"><span class="m-r-xs">Learn More</span><i class="fa fa-angle-right text-light"></i></a>'+
      '</div>';
    }
  }

  window.HeroMap = HeroMap;

  $.fn.heroMap = function(option) {
    return this.each(function() {
      var $this = $(this),
      data = $this.data('t.heroMap');

      if (!data) $this.data('t.heroMap', ( data = new HeroMap(this) ));

      if (typeof option === 'string') data[option]();
    });
  };

  $('#map').heroMap();

})(window);

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
    this.TAB_KEY = 9;
    
    this.init();

    this.$win
      .on('scroll', this.onScroll.bind(this))
      .on('resize', this.onResize.bind(this))
      .scroll()
      .resize();
    $(document).on('keyup', this.onKeyUp.bind(this));
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
    onKeyUp: function(e) {
      if (e.keyCode !== this.TAB_KEY) return;
      if ($(document.activeElement).closest('.sidenav').length) {
        this.$el.addClass('in');
      } else {
        this.$el.removeClass('in');
      }
    },
    onScroll: function(e) {
      var scrolledBottom = this.$win.scrollTop() + this.$win.height();
      var scrolledPx = scrolledBottom - this.$scrollingAreaOffsetTop;
      if (scrolledPx < 0) return;
      var scrolledPercent = (scrolledPx /  this.$scrollingAreaHeight) * 100;
      if (scrolledPercent > 99) {
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
          $('[data-section="'+sectionId+'"]')
            .addClass('read')
            .find('.text-bold')
            .removeClass('text-bold');
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
        var shrunkWidth = this.containerWidth - (st * 2);
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
          this.$video.css({ top: (this.stickyColumnBottom + this.headerHeight) - (st + this.headerHeight + videoHeight)});
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
  };

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
