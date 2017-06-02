var sampleApp = angular.module('sampleApp', ['ngRoute']);
sampleApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.htm"
    })
    .when("/StripeSub", {
        templateUrl : "StripeSub.html",
        controller : "SubCtrl"
    })
    .when("/opendataA", {
        templateUrl : "opendataA.html",
        controller : "myCtrl"
    });
});
sampleApp.controller('StartCtrl',function ($scope, $http, $location){
    
  parseParams = function() {
    var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  };

  params = parseParams();
  
  $scope.name = "Name ?";
  if (params.access_token) {
    $http({
      method: 'GET',
      url: 'https://graph.facebook.com/v2.5/me?fields=id,name&access_token=' + params.access_token
    }).then(function (response) {
      $scope.name = response.data.name;
    }, function (err) {
      $scope.name = err;
    });
  }

  $scope.login = function() {
    window.location.href = "https://www.facebook.com/dialog/oauth?client_id=TODO&response_type=token&redirect_uri=http://localhost:5000/"
  };
    $http.get("http://localhost:5000/api/users").success(function (res) {
        // Doe iets met resultaat 'res'
        $scope.result = res;
    });

        $scope.newperson = {};

        $scope.addPerson = function() {
            $http.post("http://localhost:5000/api/user",
            { 'firstname' : $scope.newperson.firstname }
            ).success(function (res) {
            $scope.result = res;
            });
            $scope.newperson.firstname="";
            }
    
  $scope.goToSub =function(){
      $location.path('StripeSub');
  };


});

      sampleApp.controller('SubCtrl', function($scope, $http, $location) {
        var getToken = function(successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/tokens',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer sk_test_aDAMZEgxHl88xZNvrtFWDHjX'
            },
            data: 'card[number]=' + $scope.cardNumber + '&card[exp_month]=' + $scope.cardExpMonth + '&card[exp_year]=' + $scope.cardExpYear + '&card[cvc]=' + $scope.cardCvc
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            debugger;
            successCb(data["data"]["id"]); // Of data.data.id, is hetzelfde
          }, errCb).catch(errCb);
        };

        var createCustomer = function(token, successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/customers',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer sk_test_aDAMZEgxHl88xZNvrtFWDHjX'
            },
            data: 'source=' + token
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            successCb(data.data.id);
          }, errCb).catch(errCb);
        };

        var createSubscription = function(customer, plan, successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/subscriptions',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer sk_test_aDAMZEgxHl88xZNvrtFWDHjX'
            },
            data: 'plan=' + plan + '&customer=' + customer
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            successCb()
          }, errCb).catch(errCb);
        };

        var subscribe = function (plan) {
          getToken(function (token) {
            createCustomer(token, function (customer) {
              createSubscription(customer, plan, function (status) {
                alert("Subscribed!");
              });
            });
          });
        };

        $scope.subscribeSilver = function() {
          subscribe('Silver');
            $location.path('opendataA');
        };

        $scope.subscribeGold = function() {
          subscribe('Gold');
            $location.path('opendataA');
        };
      });

 sampleApp.controller('myCtrl', function($scope, $http) {
            $http({
                method : "GET",
                url : "http://datasets.antwerpen.be/v1/infrastructuur/akaartlocatie.json"
            }).then(function mySuccess(response) {
                $scope.dataAnt = response.data.akaartlocatie;
                }, function myError(response) {
                $scope.dataAnt = response.statusText;
            });
              
           
            $scope.zoek = function(){
                $scope.adres = document.getElementById("maps_adres").value
                console.log($scope.adres);
       document.getElementById("maps").src = "https://www.google.com/maps/embed/v1/search?q=" + $scope.adres +
        "&key=AIzaSyCotgPPX9TvbAEMnYuJaFB7mITVORFKgQI"
            }
            });
