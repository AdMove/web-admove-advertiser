(function () {
    'use strict';

    angular
        .module('app.pages.auth.confirm-v2')
        .controller('ConfirmController', ConfirmController);

    /** @ngInject */
    function ConfirmController($stateParams, MainNavigator, $log) {
        var vm = this;

        console.log($stateParams);
        console.log($stateParams.user);
        if (!$stateParams.user) {
            MainNavigator.goToLogin();
        }
        vm.confirm = function () {
            $stateParams.user.confirmRegistration(vm.form.confirmationCode)
                .then(function () {
                    MainNavigator.goToLogin();
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        vm.resendCode = function () {
            $stateParams.user.resendConfirmationCode()
                .then(function (result) {
                    $log.info(result);
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }


    }
})();
