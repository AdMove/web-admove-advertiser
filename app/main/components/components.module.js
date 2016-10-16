(function () {
    'use strict';

    angular
        .module('app.components', [
            'app.components.maps'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {
        // Navigation
        msNavigationServiceProvider.saveItem('components', {
            title: 'COMPONENTS',
            group: true,
            weight: 4
        });

        msNavigationServiceProvider.saveItem('components.maps', {
            title: 'Maps',
            icon: 'icon-map-marker',
            state: 'app.components_maps',
            weight: 5
        });

    }
})();
