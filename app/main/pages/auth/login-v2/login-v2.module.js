(function () {
    'use strict';

    angular
        .module('app.pages.auth.login-v2', ['app.commons'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, AUTH_PERMISSION_TYPES) {
        // State
        $stateProvider.state('app.pages_auth_login-v2', {
            url: '/pages/auth/login-v2',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_login-v2': {
                    templateUrl: 'app/main/pages/auth/login-v2/login-v2.html',
                    controller: 'LoginV2Controller as vm'
                }
            },
            bodyClass: 'login-v2',
            requiresPermissionType: AUTH_PERMISSION_TYPES.Allowed
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/login-v2');

    }

})();
