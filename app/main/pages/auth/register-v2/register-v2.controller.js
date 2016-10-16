(function () {
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */

    function RegisterV2Controller($scope, MainNavigator, UserPool, User, AWSUtils) {
        var vm = this;

        vm.register = function () {
            var attributes = AWSUtils.toAttributeList(vm.form, ['username', 'password', 'passwordConfirm']);
            console.log(attributes);
            UserPool.signUp(vm.form.username, vm.form.password, attributes)
                .then(function (result) {
                    MainNavigator.goToConfirm({
                        user: User(result.user)
                    });
                })
                .catch(function () {
                    $scope.registerForm.username.$setValidity("usernameAlreadyExists", false);
                });
        };

        vm.usernameChanged = function () {
            // TODO: Needs clarification!
            $scope.registerForm.username.$setValidity("usernameAlreadyExists", true);
        };

    }
})();
