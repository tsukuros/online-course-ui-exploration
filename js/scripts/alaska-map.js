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
  }

  function initMap() {
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
      });
    });

    var infowindow = new google.maps.InfoWindow({
      content: '',
      maxWidth: 385,
    });

    markerInstances.forEach(function(markerInstance) {
      markerInstance.addListener('click', function() {
        markerInstances.forEach(function(markerInst) {
          if (markerInstance !== markerInst) markerInst.setIcon(null);
        });
        markerInstance.setIcon({
          url: 'assets/images/part-3/active-bullseye.svg',
          size: new google.maps.Size(136, 136),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(68, 68),
        });
        infowindow.setContent(getInfoWindowContent(markerInstance.getTitle()));
        infowindow.open(map, markerInstance);
      });
    });
  };

  win.initMap = initMap;

})(window);
