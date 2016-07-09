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
            map.addListener('click', addLatLng);

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