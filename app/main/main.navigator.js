(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('MainNavigator', MainNavigator);

    /** @ngInject */
    function MainNavigator($state) {
        return {
            goToMain: _goToMain,
            goToLogin: _goToLogin,
            goToConfirm: _goToConfirm,
            goToRegister: _goToRegister,
            goToForgotPassword: _goToForgotPassword
        };

        function _goToLogin(args) {
            $state.go('app.pages_auth_login-v2', args);
        }

        function _goToRegister(args) {
            $state.go('app.pages_auth_register-v2', args);
        }

        function _goToConfirm(args) {
            $state.go('app.pages_auth_confirm-v2', args);
        }

        function _goToForgotPassword(args) {
            $state.go('app.pages_auth_forgot-password', args);
        }

        function _goToMain(args) {
            $state.go('app.sample', args);
        }
    }

})();
