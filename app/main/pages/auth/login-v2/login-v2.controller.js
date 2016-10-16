(function () {
    'use strict';

    angular
        .module('app.pages.auth.login-v2')
        .controller('LoginV2Controller', LoginV2Controller);

    /** @ngInject */
    function LoginV2Controller(User, CognitoCredentials, MainNavigator, $log) {
        // Data
        var vm = this;

        vm.login = function () {
            $log.log(vm);
            var user = User(vm.form.username);
            user.signIn(vm.form.password)
                .then(function (result) {
                    $log.info(result);
                    CognitoCredentials.setNewCredentials(result.getIdToken().getJwtToken())
                        .then(function () {
                            MainNavigator.goToMain();
                        });
                })
                .catch(function (error) {
                    $log.error(error);
                    switch (error.code) {
                        case "UserNotFoundException":
                            alert("Invalide username or password");
                            vm.form.password = '';
                            break;
                        case "UserNotConfirmedException":
                            MainNavigator.goToConfirm({
                                user: user
                            });
                            break;
                    }
                });
        };

    }
})();
