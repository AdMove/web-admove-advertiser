(function () {
    'use strict';

    angular
        .module('app')
        .factory('Dynamo', Dynamo);

    Dynamo.$inject = ['$q'];
    function Dynamo($q) {
        var users_table = 'admove-mobilehub-297572719-UsersData';
        var advertisers_table = 'admove-advertiser-137513719-AdvertiserData';
        var locations_table = 'admove-mobilehub-297572719-Locations';
        var dynamodb;

        var service = {};

        service.getFreeUsers = function () {
            var params = {
                TableName: users_table,
                FilterExpression: 'takeSuggestions = :suggestion',
                ExpressionAttributeValues: {
                    ':suggestion': {N: '1'}
                }
            };
            return callWithParams(params, 'scan');
        };

        service.getMyUsers = function(uid){
            var params = {
                TableName: advertisers_table,
                Key: {
                    userId: {S: uid}
                }
            };
            return callWithParams(params, 'getItem');
        };

        service.getUserSettings = function(uid){
            var params = {
                TableName: users_table,
                Key: {
                    userId: {S: uid}
                }
            };
            return callWithParams(params, 'getItem');
        };

        service.getLocationsOfUser = function (userId) {
            var params = {
                TableName: locations_table,
                KeyConditionExpression: "userId = :uid",
                ExpressionAttributeValues: {
                    ":uid": {S: userId}
                }
            };
            return callWithParams(params);
        };

        service.getFilteredLocationsOfUser = function (userId, startDate, endDate) {
            var params = {
                TableName: locations_table,
                KeyConditionExpression: 'userId = :uid',
                FilterExpression: 'sessionId between :start and :end',
                ExpressionAttributeValues: {
                    ':uid': {S: userId},
                    ':start': {S: startDate},
                    ':end': {S: endDate}
                }
            };
            return callWithParams(params);
        };

        return service;

        function callWithParams(params, fun) {
            if (!dynamodb) {
                dynamodb = new AWS.DynamoDB();
            }
            var deferred = $q.defer();
            dynamodb[fun || 'query'](params, function (e, data) {
                if (e) {
                    console.log(e);
                    deferred.reject(e);
                }
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }
})();