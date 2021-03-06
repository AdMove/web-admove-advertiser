(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController)
        .controller('LeftCtrl', LeftCtrl)
        .controller('RightCtrl', RightCtrl);

    HomeController.$inject = ['$scope', '$timeout', '$mdSidenav', '$log', '$cookies', 'AuthService', 'NavigationService', 'MapService', 'DialogService'];
    function HomeController($scope, $timeout, $mdSidenav, $log, $cookies, as, ns, ms, ds) {
        $scope.$on('$viewContentLoaded', function () {
            var provider = $cookies.get('auth_provider');
            var token = $cookies.get('auth_token');
            if (provider && token) {
                var logins = {};
                logins[provider] = token;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:dc8ac281-9b58-4846-ad05-862c2f5c59d8',
                    Logins: logins
                });
                AWS.config.credentials.get(function (err) {
                    if (err) {
                        $scope.$apply(function () {
                            ns.goLogin();
                            $scope.$emit('_content-loaded');
                        });
                        return console.log("Error", err);
                    }
                    $scope.$emit('_content-loaded');
                });
            } else {
                ns.goLogin();
                $timeout(function () {
                    $scope.$emit('_content-loaded');
                });
            }
        });

        $scope.$on('_content-loaded', function () {
            $scope.showFreeUsers();
        });

        $scope.showFreeUsers = function () {
            $scope.selected = 'freeUsers';
            ms.showFreeUsers()
                .then(function (data) {
                    console.log(data);
                    angular.forEach(data, function (item) {
                        google.maps.event.addListener(item.line, 'click', function () {
                            ds.showUser(
                                'User',
                                    item.user.carProducer.S + " " + item.user.carModel.S + " (" + item.user.carProductionYear.S + ")\n" + item.user.phoneNumber.S,
                                'Advertise',
                                'Cancel')
                                .then(function () {
                                    ds.alert('Call him/her', item.user.phoneNumber.S);
                                });
                        });
                        google.maps.event.addListener(item.line, 'mouseover', function () {
                            item.line.setOptions({
                                strokeWeight: 6
                            });
                        });
                        google.maps.event.addListener(item.line, 'mouseout', function () {
                            item.line.setOptions({
                                strokeWeight: 3
                            });
                        });
                    });
                });

        };

        $scope.showMyUsers = function () {
            $scope.selected = 'myUsers';
            ms.showMyUsers(AWS.config.credentials.identityId)
                .then(function (data) {
                    if (data.length == 0) {
                        ds.alert('You have no users');
                    }
                    angular.forEach(data, function (item) {
                        google.maps.event.addListener(item.line, 'click', function () {
                            ds.showUser(
                                'User',
                                item.user.carProducer.S + " " + item.user.carModel.S + " (" + item.user.carProductionYear.S + ")\n" + item.user.phoneNumber ? item.user.phoneNumber.S : '',
                                'Ok');
                        });
                        
                        google.maps.event.addListener(item.line, 'mouseover', function () {
                            item.line.setOptions({
                                strokeWeight: 6
                            });
                        });
                        google.maps.event.addListener(item.line, 'mouseout', function () {
                            item.line.setOptions({
                                strokeWeight: 3
                            });
                        });
                    });

                });

        };

        $scope.user = {
            photo: $cookies.get('user.photo'),
            name: $cookies.get('user.name'),
            email: $cookies.get('user.email')
        };

        $scope.isOpen = false;


        $scope.user = {
            photo: $cookies.get('user.photo'),
            name: $cookies.get('user.name'),
            email: $cookies.get('user.email')
        };

        $scope.isOpen = false;

        $scope.logout = as.logout;

        $scope.navigationBar = {
            isOpen: false,
            count: 0,
            selectedDirection: 'left'
        };

        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function () {
            return $mdSidenav('right').isOpen();
        };


        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }
    }

    LeftCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];
    function LeftCtrl($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };
    }

    RightCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log', 'MapService'];
    function RightCtrl($scope, $timeout, $mdSidenav, $log, ms) {

        $scope.filter = function () {
            console.log($scope.startDate);
            var startDate = new Date($scope.startDate || '2000/01/01');
            var endDate = new Date($scope.endDate || '9999/01/01');

            // there is javascript bug and dates need to set (date + 1)
            startDate.setDate(startDate.getDate() + 1);
            endDate.setDate(endDate.getDate() + 2);                             // for inclusive end date

            var s = startDate.toISOString().substr(0, 10).replace(/-/g, '');
            var e = endDate.toISOString().substr(0, 10).replace(/-/g, '');
            ms.updateFilter({
                startDate: s,
                endDate: e
            }).then(function () {
                $scope.close();
            });
        };


        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };
    }
})();