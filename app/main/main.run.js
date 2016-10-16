(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $q, UserPool, CognitoCredentials, MainNavigator, AUTH_PERMISSION_TYPES) {

        $rootScope.$on('$stateChangeStart', function (event, next) {
            switch (next.requiresPermissionType) {
                case AUTH_PERMISSION_TYPES.Allowed:
                    UserPool.getCurrentUser()
                        .then(function (user) {
                            return user.getSession();
                        })
                        .then(function (session) {
                            CognitoCredentials.setNewCredentials(session.getIdToken().getJwtToken());
                            event.preventDefault();
                            MainNavigator.goToMain();
                        });
                    break;
                case AUTH_PERMISSION_TYPES.NotConfirmed:
                    if (next.params.user) {
                        event.preventDefault();
                        MainNavigator.goToLogin()
                    }
                    break;
                case AUTH_PERMISSION_TYPES.Authenticated:
                default:
                    UserPool.getCurrentUser()
                        .then(function (user) {
                            return user.getSession();
                        })
                        .then(function (session) {
                            CognitoCredentials.setNewCredentials(session.getIdToken().getJwtToken());
                        })
                        .catch(function () {
                            event.preventDefault();
                            MainNavigator.goToLogin();
                        });
            }

        });

    }

})();
