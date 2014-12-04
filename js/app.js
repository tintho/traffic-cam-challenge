// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();

    //jquery and angular stuffs and JSON
    var camera;
    var markers = [];

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            camera = data;

            data.forEach(function(camera, itemIndex) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude)
                    },
                    map: map,
                    address: camera.cameralabel,
                    animation: google.maps.Animation.DROP
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<h2>' + camera.cameralabel + '</h2>';
                    html += '<p><img src=' + camera.imageurl.url +'>' + '</p>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                    map.panTo(marker.getPosition());
                });

                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close(marker);
                });
            });

            $("#search").bind('search keyup', function() {
                var search = document.getElementById("search").value.toLowerCase();
                for (var i = 0; i < markers.length; i++) {
                    var searchWord = markers[i].address.toLowerCase();
                    if (searchWord.indexOf(search) != -1) {
                        markers[i].setMap(map);
                    } else {
                        markers[i].setMap(null);
                    }
                };
            });
        })
        .fail(function(error) {
            console.log(error);
            alert("JSON request has failed.");
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        });
});