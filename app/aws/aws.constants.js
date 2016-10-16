(function () {
    'use strict';

    angular
        .module('app.aws')
        .constant('AWS_REGION', 'us-east-1')
        .constant('AWS_USER_POOL_DATA', {
            ClientId: '2mvci5uqkoo0jsskgg47o6hu8u',
            UserPoolId: 'us-east-1_U46H7K7PK'
        })
        .constant('AWS_IDENTITY_POOL_ID', 'us-east-1:829e72e1-dfb8-4858-a7e7-3ce385ee07f0');
})();
