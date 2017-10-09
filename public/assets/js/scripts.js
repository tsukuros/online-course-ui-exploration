;(function(win){
  var markers = [
    {
      title: 'Glacier Bay National Park and Preserve',
      lat: 58.665807,
      lng: -136.900215,
    },
    {
      title: 'Wrangell-St. Elias National Park & Preserve',
      lat: 61.710445,
      lng: -142.98568,
    },
    {
      title: 'Katmai National Park and Preserve',
      lat: 58.597529,
      lng: -154.693729,
    },
    {
      title: 'Denali National Park and Preserve',
      lat: 63.1148,
      lng: -151.192606,
    },
    {
      title: 'Togiak National Wildlife Refuge',
      lat: 59.221712,
      lng: -159.980149,
    },
    {
      title: 'Yukon Delta National Wildlife Refuge',
      lat: 61.368856,
      lng: -163.716136,
    },
    {
      title: 'Lake Clark National Park and Preserve',
      lat: 60.203294,
      lng: -154.319455,
    },
  ];
  
  function getInfoWindowContent(name) {
    return '<div id="content">'+
      '<h3 style="font-size: 16px; margin-bottom: 20px;">'+name+'</h3>'+
      '<p style="font-size: 16px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>'+
    '</div>';
  };


  function initMap() {
    var defaultIcon = {
      url: 'assets/images/part-3/bullseye.svg',
      size: new google.maps.Size(62, 62),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(31, 31),
    };
    var map = new google.maps.Map(document.getElementById('map'), {
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

        infowindow.setContent(getInfoWindowContent(markerInstance.getTitle()));
        infowindow.open(map, markerInstance);
      });
    });
  };

  win.initMap = initMap;

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
