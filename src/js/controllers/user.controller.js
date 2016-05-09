(function () {
    'use strict';

    App.controller('UserController', ['$scope', 'UserService', function ($scope, UserService) {
        var self = this;
        self.user = { id: null, username: '', password: '', email: ''};

        self.reset = function () {
            self.user = {id: null, username: '', address: '', email: ''};
            $scope.myForm.$setPristine();
        };

    }]);

})();