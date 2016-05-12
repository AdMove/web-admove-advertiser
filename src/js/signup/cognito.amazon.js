(function () {
    
    AWS.config.region = 'us-east-1';

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {
        FB.init({
            appId: '181154708936062',
            cookie: true,

            xfbml: true,
            version: 'v2.5'
        });
        FB.getLoginStatus(statusChangeCallback);
    };
    
    function statusChangeCallback(response) {
        console.log('statusChangeCallback', response);

        if (response.status === 'connected' && response.authResponse) {

            testAPI();

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:dc8ac281-9b58-4846-ad05-862c2f5c59d8',
                Logins: {'graph.facebook.com': response.authResponse.accessToken}
            });

            AWS.config.credentials.get(function (err) {
                if (err) return console.log("Error", err);
                console.log("Cognito Identity Id", AWS.config.credentials.identityId);
            });

        } else if (response.status === 'not_authorized') {
            document.getElementById('status').innerHTML = 'Please log into this app.';
        } else {
            document.getElementById('status').innerHTML = 'Please log into Facebook.';
        }
    }

    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
        });
    }

    function fbLogout() {
        FB.logout(function (result) {
            statusChangeCallback(result);
        });
    }
    
})();
