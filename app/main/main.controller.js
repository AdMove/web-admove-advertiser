(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, MainNavigator, AUTH_EVENTS) {
        // Data

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event) {
            if (event.targetScope.$id === $scope.$id) {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });

        // User not authenticated
        $scope.$on(AUTH_EVENTS.NotAuthenticated, function (event) {
            MainNavigator.goToLogin()
        });

        // User already authenticated
        $scope.$on(AUTH_EVENTS.Authenticated, function (event) {
            MainNavigator.goToMain()
        });

    }
})();
