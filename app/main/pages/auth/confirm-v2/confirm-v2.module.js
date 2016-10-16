(function () {
    'use strict';

    angular
        .module('app.pages.auth.confirm-v2', ['app.commons'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, AUTH_PERMISSION_TYPES) {
        // State
        $stateProvider.state('app.pages_auth_confirm-v2', {
            url: '/pages/auth/confirm-v2',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_confirm-v2': {
                    templateUrl: 'app/main/pages/auth/confirm-v2/confirm-v2.html',
                    controller: 'ConfirmController as vm'
                }
            },
            params: {
                user: null
            },
            bodyClass: 'confirm-v2',
            requiresPermissionType: AUTH_PERMISSION_TYPES.NotConfirmed
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/confirm-v2');

    }

})();
