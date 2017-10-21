window.markers = [
  {
    title: 'Glacier Bay National Park and Preserve',
    description: 'The earliest traces of human occupation at Glacier Bay date to about 10,000 years before the present, with archaeological sites just outside the park dating to that time.',
    srcUrl: 'https://en.wikipedia.org/wiki/Glacier_Bay_National_Park_and_Preserve#Activities',
    lat: 58.665807,
    lng: -136.900215,
  },
  {
    title: 'Wrangell-St. Elias National Park & Preserve',
    description: 'This park includes a large portion of the Saint Elias Mountains, which include most of the highest peaks in the United States and Canada, yet are within 10 miles (16 km) of tidewater, one of the highest reliefs in the world.',
    srcUrl: 'https://en.wikipedia.org/wiki/Wrangell%E2%80%93St._Elias_National_Park_and_Preserve',
    lat: 61.710445,
    lng: -142.98568,
  },
  {
    title: 'Katmai National Park and Preserve',
    description: 'Text: This park includes as many as 18 individual volcanoes, seven of which have been active since 1900. The most significant volcanic event in history was the eruption of Mount Katmai and Novarupta in June 1912. Novarupta\'s eruption covered a nearby valley with ash. At the same time, the summit of Katmai collapsed into a caldera.',
    srcUrl: 'https://en.wikipedia.org/wiki/Katmai_National_Park_and_Preserve#Volcanoes',
    lat: 58.597529,
    lng: -154.693729,
  },
  {
    title: 'Denali National Park and Preserve',
    description: 'The word "Denali" means "the high one" in the native Athabaskan language and refers to the mountain itself. The mountain was named after newly elected US president William McKinley in 1897 by local prospector William A. Dickey.',
    srcUrl: 'https://en.wikipedia.org/wiki/Denali_National_Park_and_Preserve#Naming_controversy',
    lat: 63.1148,
    lng: -151.192606,
  },
  {
    title: 'Togiak National Wildlife Refuge',
    description: 'The Togiak National Wildlife Refuge is dominated by the Ahklun Mountains in the north and the cold waters of Bristol Bay to the south. The natural forces that have shaped this land range from the violent and powerful to the geologically patient.',
    srcUrl: 'https://en.wikipedia.org/wiki/Togiak_National_Wildlife_Refuge',
    lat: 59.221712,
    lng: -159.980149,
  },
  {
    title: 'Yukon Delta National Wildlife Refuge',
    description: 'The refuge\'s coastal region bordering the Bering Sea is a rich, productive wildlife habitat supporting one of the largest concentrations of water fowl in the world.',
    srcUrl: 'https://en.wikipedia.org/wiki/Yukon_Delta_National_Wildlife_Refuge',
    lat: 61.368856,
    lng: -163.716136,
  },
  {
    title: 'Lake Clark National Park and Preserve',
    description: 'Lake Clark preserves a wide variety of Alaskan landscapes and ecosystems, corresponding to its four main physiographic areas. The coastal sections running along the Cook Inlet from Tuxedni Bay to Chinitna Bay include coastline and marine ecosystems. The mountains of the Alaska, Aleutian and Chigmit Ranges with their glaciers form a second region.',
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
      
      google.maps.event.addListener(map, "click", function(event) {
        that.closeInfoWindow(infowindow, markerInstances, defaultIcon);
      });

      $(document).on('keyup', function(e){
        if (e.keyCode === 27) that.closeInfoWindow(infowindow, markerInstances, defaultIcon);
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

          infowindow.setContent(
            that.getInfoWindowContent(
              that.getMarker(markerInstance.getTitle())
            )
          );
          infowindow.open(map, markerInstance);
        });
      });
    },
    closeInfoWindow: function(infowindow, markerInstances, defaultIcon) {
      infowindow.close();
      markerInstances.forEach(function(markerInst) {
        markerInst.setIcon(defaultIcon);
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
  };

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
