(function () {
    'use strict';

    angular
        .module('app.aws')
        .factory('AWSUtils', AWSUtilsFactory);

    /** @ngInject */
    function AWSUtilsFactory(AWSComponentsFactory) {

        return {
            toAttributeList: toAttributeList
        };

        function toAttributeList(item, skip) {
            skip = skip || [];
            var attributeList = [];
            angular.forEach(item, function (value, key) {
                if (!_arrayContains(skip, key)) {
                    attributeList.push(AWSComponentsFactory.getCognitoUserAttribute(key, value));
                }
            });
            return attributeList;
        }

        function _arrayContains(array, item) {
            return array.indexOf(item) !== -1;
        }

    }

})();
