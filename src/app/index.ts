/// <reference path="../../.tmp/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/sessions/session.controller.ts" />
/// <reference path="../app/sessions/sessions.controller.ts" />
/// <reference path="../app/services/logService.ts" />

module flexportal {
  'use strict';
  
  angular.module('flexportal', ['ngAnimate', 'ngTouch', 'ngSanitize', 'restangular', 'ngRoute', 'ngMaterial'])
    .controller('MainCtrl', MainCtrl)
    .controller('NavbarCtrl', NavbarCtrl)
    .controller('SessionController', SessionController)
    .controller('SessionsController', SessionsController)
    .service('LogService', LogService)

    .config(function($routeProvider: ng.route.IRouteProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/main/main.html',
          controller: MainCtrl
        })
        .when('/sessions/:id/:id1/:id2', {
          templateUrl: 'app/sessions/session.html',
          controller: SessionController
        })
        .when('/sessions', {
          templateUrl: 'app/sessions/sessions.html',
          controller: SessionsController
        })
        .otherwise({
          redirectTo: '/'
        });
    })
  ;
}