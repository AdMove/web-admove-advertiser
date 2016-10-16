(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            // Sample
            'app.sample',

            // Pages
            'app.pages',

            // Commons
            'app.commons',

            // AWS module
            'app.aws',

            // Apps
            'app.dashboards',
            'app.e-commerce',

            // Components
            'app.components'
        ]);
})();
