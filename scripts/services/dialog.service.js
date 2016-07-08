(function () {
    angular
        .module('app')
        .factory('DialogService', DialogService);

    DialogService.inject = ['$mdDialog'];
    function DialogService($mdDialog) {

        var service = {
            alert: alert,
            prompt: prompt,
            confirm: confirm
        };

        return service;

        function alert(title, body, okTitle){
            return $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(body)
                    .ariaLabel('AlertDialog')
                    .ok(okTitle || 'Ok')
            );
        }

        function prompt(title, body, placeholder, okTitle, cancelTitle){
            var confirm = $mdDialog.prompt()
                .title(title)
                .textContent(body)
                .placeholder(placeholder)
                .ariaLabel(placeholder)
                .ok(okTitle || 'Ok')
                .cancel(cancelTitle || 'Cancel');
            return $mdDialog.show(confirm);
        }

        function confirm(title, body, okTitle, cancelTitle){
            var confirm = $mdDialog.confirm()
                .title(title)
                .textContent(body)
                .ariaLabel('confirm')
                .ok(okTitle)
                .cancel(cancelTitle);
            return $mdDialog.show(confirm);
        }

    }
})();