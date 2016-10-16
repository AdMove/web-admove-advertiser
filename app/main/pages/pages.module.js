(function () {
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth.login-v2',
            'app.pages.auth.register-v2',
            'app.pages.auth.confirm-v2',
            'app.pages.auth.forgot-password'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {
        // Navigation
        msNavigationServiceProvider.saveItem('pages', {
            title: 'PAGES',
            group: true,
            weight: 2
        });
    }
})();
