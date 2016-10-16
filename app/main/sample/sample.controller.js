(function () {
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData, UserPool) {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        UserPool.getCurrentUser().then(console.log);

        // Methods

        //////////
    }
})();
