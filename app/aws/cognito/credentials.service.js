(function () {
    'use strict';

    angular
        .module('app.aws')
        .factory('CognitoCredentials', CognitoCredentials);


    /** @ngInject */
    function CognitoCredentials(AWS_IDENTITY_POOL_ID, AWS_REGION, AWS_USER_POOL_DATA, $q) {
        return {
            setNewCredentials: setNewCredentials,
            refresh: refresh
        };

        function setNewCredentials(token) {
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: AWS_IDENTITY_POOL_ID, // your identity pool id here
                Logins: _constructUserPoolLogins(token)
            });
            return refresh();
        }

        function _constructUserPoolLogins(token) {
            var result = {};
            result['cognito-idp.' + AWS_REGION + '.amazonaws.com/' + AWS_USER_POOL_DATA.UserPoolId] = token;
            return result;
        }

        function refresh() {
            var deferred = $q.defer();
            AWS.config.credentials.refresh(function (error) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }
    }

})();
