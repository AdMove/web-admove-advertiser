(function () {
    'use strict';

    angular
        .module('app.aws')
        .factory('AWSComponentsFactory', AWSComponentsFactory);

    /** @ngInject */
    function AWSComponentsFactory(AWS_USER_POOL_DATA) {
        var _cognitoUserPool;

        return {
            getCognitoUser: _getCognitoUser,
            getCognitoUserPool: _getCognitoUserPool,
            getCognitoUserAttribute: _getCognitoUserAttribute,
            getCognitoAuthenticationDetails: _getCognitoAuthenticationDetails
        };

        function _getCognitoUserPool() {
            if (!_cognitoUserPool) {
                _cognitoUserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(AWS_USER_POOL_DATA)
            }
            return _cognitoUserPool
        }

        function _getCognitoUserAttribute(key, value) {
            var data = {
                Name: key,
                Value: value
            };
            return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(data);
        }

        function _getCognitoAuthenticationDetails(username, password) {
            var authenticationData = {
                Username: username,
                Password: password
            };
            return new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData)
        }

        function _getCognitoUser(username) {
            var userData = {
                Username: username,
                Pool: _getCognitoUserPool()
            };
            return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)
        }

    }

})();
