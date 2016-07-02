(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$cookies', 'NavigationService','$timeout'];
    function RegisterController($scope, $cookies, ns, $timeout) {
        $scope.goLogin = ns.goLogin;

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
                        $scope.$emit('_content-loaded');
                        return console.log("Error", err);
                    }
                    $scope.$apply(function () {
                        ns.goHome();
                        $scope.$emit('_content-loaded');
                    });
                });
            }else{
                $timeout(function () {
                    $scope.$emit('_content-loaded');
                });
            }
        });
    }

})();