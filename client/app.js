var labTutorApp = angular.module('labTutorApp', ['ngRoute']);
labTutorApp.config(function($routeProvider) {
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
labTutorApp.controller('StartCtrl',function ($scope, $http, $location){
    
  parseParams = function() {
    var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  };

  params = parseParams();
  
  $scope.name = "Name will be inflated here";
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
    window.location.href = "https://www.facebook.com/dialog/oauth?client_id=183035075400001&response_type=token&redirect_uri=http://localhost:5000/"
  };
    
  $scope.goToSub =function(){
      $location.path('StripeSub.html');
  };


});
