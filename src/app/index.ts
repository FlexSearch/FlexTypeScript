/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../app/partials/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/views/sessions/session.controller.ts" />
/// <reference path="../app/views/sessions/sessions.controller.ts" />

module flexportal {
  'use strict';

  angular.module('flexportal', ['ngAnimate', 'ngTouch', 'ngSanitize', 'restangular', 'ngMaterial', 'ui.router'])
    .controller('MainCtrl', MainCtrl)
    .controller('SessionController', ["$scope", "$stateParams", SessionController])
    .controller('SessionsController', SessionsController)
    .config(function($mdThemingProvider: ng.material.MDThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('teal');
    })
    .config(function($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
      $urlRouterProvider.otherwise("/main");

      $stateProvider
        .state('main', {
          url: "/main",
          templateUrl: "app/partials/main.html",
          controller: MainCtrl
        })
        .state('sessions', {
          url: "/sessions",
          templateUrl: "app/views/sessions/sessions.html",
          controller: SessionsController
        })
        .state('session', {
          url: "/session/:id",
          templateUrl: "app/views/sessions/session.html",
          controller: SessionController
        });
    });
}
