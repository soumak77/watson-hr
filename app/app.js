// Angular Base Apps Configuration
import fs from 'fastclick';
import angular from 'angular';
import 'angular-base-apps';
import 'angular-google-chart/ng-google-chart';
import 'angular-ui-router';
import 'angular-resource';

// Firebase Configuration
import firebase from 'firebase';
import 'angularfire';
import firebaseconfig from './config/config-firebase';
firebase.initializeApp(firebaseconfig);

// Route Configuration
import 'angular-dynamic-routing/dynamicRouting';
import 'angular-dynamic-routing/dynamicRouting.animations';
import routeconfig from './config/config-routes';

// Application Configuration
import moduleconfig from './modules';

const AppConfig = ($urlProvider, $locationProvider, $firebaseRefProvider, $BaseAppsStateProvider) => {
  $urlProvider.otherwise('/');

  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $firebaseRefProvider.registerUrl(firebaseconfig.databaseURL);

  $BaseAppsStateProvider.registerDynamicRoutes(routeconfig);
};

AppConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$firebaseRefProvider', '$BaseAppsStateProvider'];

const AppRun = () => {
  fs.FastClick.attach(document.body);
};

angular.module('application', [
  'ui.router',
  'ngAnimate',
  'ngResource',

  // firebase
  'firebase',

  // base apps
  'base',

  // google charts
  'googlechart',

  // dynamic routing
  'dynamicRouting',
  'dynamicRouting.animations'
].concat(moduleconfig))
.config(AppConfig)
.run(AppRun);
