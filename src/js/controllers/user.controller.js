(function () {
    'use strict';

    App.controller('UserController', ['$scope', function ($scope) {
        var self = this;
        self.user = {id: null, username: '', password: '', email: ''};

        self.reset = function () {
            self.user = {id: null, username: '', address: '', email: ''};
        };

    }]);

})();