(function () {
    'use strict';

    angular
        .module('app.pages.auth.forgot-password', ['app.commons'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, AUTH_PERMISSION_TYPES) {
        // State
        $stateProvider.state('app.pages_auth_forgot-password', {
            url: '/pages/auth/forgot-password',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_forgot-password': {
                    templateUrl: 'app/main/pages/auth/forgot-password/forgot-password.html',
                    controller: 'ForgotPasswordController as vm'
                }
            },
            bodyClass: 'forgot-password',
            requiresPermissionType: AUTH_PERMISSION_TYPES.Allowed
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/forgot-password');

    }

})();
