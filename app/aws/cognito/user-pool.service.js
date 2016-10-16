(function () {
    'use strict';

    angular
        .module('app.aws')
        .service('UserPool', UserPoolWrapper);

    /** @ngInject */
    function UserPoolWrapper(AWSComponentsFactory, User, $q) {
        var self = this;

        self.signUp = function (username, password, attributes) {
            var deferred = $q.defer();
            var userPool = AWSComponentsFactory.getCognitoUserPool();
            userPool.signUp(username, password, attributes, null, function (error, result) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(result);
                }
            });
            return deferred.promise;
        };

        self.getCurrentUser = function () {
            var deferred = $q.defer();
            var cognitoUser = AWSComponentsFactory.getCognitoUserPool().getCurrentUser();
            if (cognitoUser != null) {
                deferred.resolve(User(cognitoUser));
            } else {
                deferred.reject();
            }
            return deferred.promise;
        };

    }
})();
