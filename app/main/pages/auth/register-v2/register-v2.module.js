(function () {
    'use strict';

    angular
        .module('app.pages.auth.register-v2', ['app.commons', 'ngPassword'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, AUTH_PERMISSION_TYPES) {
        // State
        $stateProvider.state('app.pages_auth_register-v2', {
            url: '/pages/auth/register-v2',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_register-v2': {
                    templateUrl: 'app/main/pages/auth/register-v2/register-v2.html',
                    controller: 'RegisterV2Controller as vm'
                }
            },
            bodyClass: 'register-v2',
            requiresPermissionType: AUTH_PERMISSION_TYPES.Allowed
        });

        // Translate
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/register-v2');

    }

})();
