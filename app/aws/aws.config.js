(function () {
    'use strict';

    angular
        .module('app.aws')
        .config(Config);

    /** @ngInject */
    function Config(AWS_REGION) {
        AWSCognito.config.region = AWS_REGION;
        AWS.config.region = AWS_REGION;
    }

})();
