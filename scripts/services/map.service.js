(function () {
    'use strict';

    angular
        .module('app')
        .factory('MapService', MapService);

    MapService.$inject = ['Dynamo', '$q'];
    function MapService(dynamo, $q) {
        var map, poly, roads = [];
        var filter, currentUsers;
        var service = {};

        service.initMap = function (elem) {
            map = new google.maps.Map(elem, {
                zoom: 13,
                center: new google.maps.LatLng(41.7166, 44.7833)
            });

            poly = new google.maps.Polyline({
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            poly.setMap(map);

            // Add a listener for the click event
            // map.addListener('click', addLatLng);

            // Handles click events on a map, and adds a new point to the Polyline.
            function addLatLng(event) {
                var path = poly.getPath();

                // Because path is an MVCArray, we can simply append a new coordinate
                // and it will automatically appear.
                path.push(event.latLng);

            }
        };

        service.placeRoad = function (road, color) {
            var p = new google.maps.Polyline({
                path: road,
                strokeColor: color || '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            p.setMap(map);
            roads.push(p);

            var info = new google.maps.InfoWindow({
                content: ''+distance(road)
            });
            var marker = new google.maps.Marker({
                title: ''+distance(road)
            });
            google.maps.event.addListener(p, 'mouseover', function (e) {
                marker.setPosition(e.latLng);
                marker.setMap(map);
                info.open(map, marker);
            });
            google.maps.event.addListener(p, 'mouseout', function () {
                marker.setMap(null);
            });

            return p;
        };

        service.clearRoads = function () {
            angular.forEach(roads, function (road) {
                google.maps.event.clearListeners(road, 'mouseover');
                google.maps.event.clearListeners(road, 'mouseout');
                road.setMap(null);
            });
            roads = [];
        };


        service.showFreeUsers = function () {
            var deferred = $q.defer();
            currentUsers = 'freeUsers';
            service.clearRoads();
            dynamo.getFreeUsers()
                .then(function (data) {
                    var polylines = [];
                    var users = data.Items;
                    angular.forEach(users, function (item, index) {
                        var color = getRandomColor();
                        var promise;
                        if (filter){
                            promise = dynamo.getFilteredLocationsOfUser(item.userId.S, filter.startDate, filter.endDate);
                        }else{
                            promise = dynamo.getLocationsOfUser(item.userId.S);
                        }
                        promise
                            .then(function (data) {
                                var roads = splitRoad(data.Items);
                                angular.forEach(roads, function (road) {
                                    var line = service.placeRoad(road.map(function (item) {
                                        return new google.maps.LatLng(item.latitude.N, item.longitude.N);
                                    }), color);
                                    polylines.push({line: line, user: item});
                                    map.setCenter(new google.maps.LatLng(road[road.length - 1].latitude.N, road[road.length - 1].longitude.N));
                                });
                                if (index >= users.length-1) {
                                    deferred.resolve(polylines);
                                }
                            });
                    });
                });
            return deferred.promise;
        };

        service.showMyUsers = function(uid){
            var deferred = $q.defer();
            currentUsers = 'freeUsers';
            service.clearRoads();
            dynamo.getMyUsers(uid)
                .then(function (data) {
                    var polylines = [];
                    var users = data.Item.users.SS;
                    angular.forEach(users, function (item, index) {
                        var color = getRandomColor();
                        var promise;
                        if (filter){
                            promise = dynamo.getFilteredLocationsOfUser(item, filter.startDate, filter.endDate);
                        }else{
                            promise = dynamo.getLocationsOfUser(item);
                        }
                        promise
                            .then(function (data) {
                                var roads = splitRoad(data.Items);
                                angular.forEach(roads, function (road) {
                                    var line = service.placeRoad(road.map(function (item) {
                                        return new google.maps.LatLng(item.latitude.N, item.longitude.N);
                                    }), color);
                                    dynamo.getUserSettings(item).then(function(user){
                                        polylines.push({line: line, user: user.Item});
                                        if (index >= users.length-1) {
                                            deferred.resolve(polylines);
                                        }
                                    });
                                    map.setCenter(new google.maps.LatLng(road[road.length - 1].latitude.N, road[road.length - 1].longitude.N));
                                });
                            });
                    });
                });
            return deferred.promise;
        };

        service.updateFilter = function(f){
            filter = f;
            if (currentUsers === 'freeUsers'){
                return service.showFreeUsers();
            }
        };

        return service;
    }

    function distance(args){
        var data;
        if (Object.prototype.toString.call( args ) === '[object Array]'){
            data = args;
        }else{
            data = arguments;
        }
        if (data.length > 1){
            var p1 = data[0];
            var distance = 0;
            for (var i=1; i<data.length; i++){
                var p2 = data[i];
                distance += _dist(p1, p2);
                p1 = p2;
            }
            return distance;
        }
    }

    function _dist(point1, point2){
        var lat1 = point1.lat();
        var lat2 = point2.lat();
        var lon1 = point1.lng();
        var lon2 = point2.lng();
        var R = 6371; // Radius of the earth in km
        var dLat = _deg2rad(lat2-lat1);
        var dLon = _deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    function _deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function splitRoad(road) {
        if (road && road.length > 0) {
            var result = [];
            var cur = [];
            var ses = road[0].sessionId.S;
            for (var i = 0; i < road.length; i++) {
                if (road[i].sessionId.S === ses) {
                    cur.push(road[i]);
                } else {
                    result.push(cur);
                    ses = road[i].sessionId.S;
                    cur = [road[i]];
                }
            }
            if (cur.length > 0) {
                result.push(cur);
            }
            return result;
        }
    }
})();