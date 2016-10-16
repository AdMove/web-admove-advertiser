(function () {
    'use strict';

    angular
        .module('app.aws')
        .factory('User', UserService);

    /** @ngInject */
    function UserService(AWSComponentsFactory, $q) {

        return function (username) {
            var user;
            if (angular.isString(username)) {
                user = AWSComponentsFactory.getCognitoUser(username);
            } else {
                user = username;
            }
            return new UserWrapper(user);
        };

        function UserWrapper(user) {
            var self = this;

            self.getUser = function () {
                return user;
            };

            self.signIn = function (password) {
                var deferred = $q.defer();
                var details = AWSComponentsFactory.getCognitoAuthenticationDetails(user.username, password);
                user.authenticateUser(details, {
                    onSuccess: function (result) {
                        deferred.resolve(result);
                    },

                    onFailure: function (error) {
                        deferred.reject(error);
                    }
                });

                return deferred.promise;
            };

            self.signOut = function () {
                var deferred = $q.defer();
                user.signOut();
                return deferred.promise;
            };

            self.resendConfirmationCode = function () {
                var deferred = $q.defer();
                user.resendConfirmationCode(function (error, result) {
                    if (error) {
                        alert(error);
                        return;
                    }
                    console.log('Call result: ' + result);
                });
                return deferred.promise;
            };

            self.confirmRegistration = function (code) {
                var deferred = $q.defer();
                user.confirmRegistration(code, true, function (error, result) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(result);
                    }
                });
                return deferred.promise;
            };

            self.resendConfirmationCode = function () {
                var deferred = $q.defer();
                user.resendConfirmationCode(function (error, result) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(result);
                    }
                });
                return deferred.promise;
            };

            self.getSession = function () {
                var deferred = $q.defer();
                user.getSession(function (error, result) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(result);
                    }
                });
                return deferred.promise;
            }

        }
    }


})();
