(function () {
    'use strict';

    angular
        .module('app.commons')
        .constant('AUTH_EVENTS', {
            LoginSuccess: 'auth-login-success',
            LoginFailed: 'auth-login-failed',
            LogoutSuccess: 'auth-logout-success',
            Authenticated: 'auth-authenticated',
            NotAuthenticated: 'auth-not-authenticated',
            NotAuthorized: 'auth-not-authorized',
            SessionTimeout: 'auth-session-timeout'
        })
        .constant('AUTH_PERMISSION_TYPES', {
            Allowed: 'allowed',
            NotConfirmed: 'notConfirmed',
            Authenticated: 'authenticated'
        })

})();
