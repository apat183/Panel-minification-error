"use strict";
/* global angular, Firebase */
angular.module("mainApp.services")
  .factory("demoService", ['$firebaseObject', '$firebaseArray', 'Auth', '$q', '$location', '$mdPanel', '$rootScope', '$timeout', function ($firebaseObject, $firebaseArray, Auth, $q, $location, $mdPanel, $rootScope, $timeout) {

    var demoService = {};

    var config = {
      attachTo: angular.element(document.body),
      controllerAs: '$ctrl',
      position: $mdPanel.newPanelPosition()
        .absolute()
        .top('50%')
        .left('50%'),
      locals: {},
      hasBackdrop: true,
      clickOutsideToClose: false,
      escapeToClose: false,
      focusOnOpen: true,
      zIndex: 9999999
    };

    var demoItem = 0;
    var switcher;
    var target;

    //controllers need to update the following:
    //controller: function
    //templateUrl: 'dialog-template.html'
    //locals: {}
    //position: $mdPanel.newPanelPosition().relativeTo('#global-search-button').addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

    // Auth.saveSettings = function (area, key, value, callback) {

    //   if (!Auth.user.settings) {
    //     Auth.user.settings = {};
    //   }

    //   if (!Auth.user.settings[area]) {
    //     Auth.user.settings[area] = {};
    //   }

    //   var areaSettings = Auth.user.settings[area];
    //   areaSettings[key] = value;
    //   Auth.user.$loaded(function () {
    //     Auth.user.$save();
    //   })


    //   callback(Auth.user.settings[area]);

    // }

    // Auth.getSettings = function (area, callback) {


    demoService.initDemo = function () {

      var location = $location.path();

      demoItem = 0;

      switch (location) {
        case '/userhome':
          initUserhome();
          break;
      }
      
    }

    function showPanel() {
      $mdPanel.open(config);
    }

    function initUserhome() {

      switcher = function (item) {
        switch (item) {
          case 0:
            welcome();
            break;
          case 1:
            target = "#navContainer"
            navigation();
            break;
          case 2:
            target = "#user-settings"
            userSettings();
            break;
          case 3:
            target = "#global-search-button"
            universalSeach();
            break;
          default:
            target = "#demo-help"
            downHere();
            break;
        }
      }

      welcome();

    }

    function userhomeController(mdPanelRef) {

      this.close = function () {
        $(target).removeClass("highlight");
        mdPanelRef.close()
        if (target === "#demo-help") {
           Auth.saveSettings("demo", "welcome", true)
        };
      }

      this.next = function () {

        if (demoItem === 1) {
          $rootScope.$broadcast('openNav');
        }

        $(target).removeClass("highlight");

        mdPanelRef.close()
        demoItem++;
        switcher(demoItem)
      }

      this.back = function () {
        $(target).removeClass("highlight");
        mdPanelRef.close()
                
        if (demoItem === 1) {
          $rootScope.$broadcast('openNav');
        }

        demoItem--;

        switcher(demoItem)
      }

    }

    function downHere() {
      var position = $mdPanel.newPanelPosition()
        .relativeTo(target)
        .addPanelPosition($mdPanel.xPosition.OFFSET_END)
        .bottom()

      config.controller = userhomeController
      config.templateUrl = 'components/demo/help.html'
      config.position = position;

      $(target).addClass("highlight");

      showPanel();
    }

    function welcome() {
      var position = $mdPanel.newPanelPosition()
        .absolute()
        .center();

      config.locals = { user: Auth.user };
      config.controller = userhomeController
      config.templateUrl = 'components/demo/welcome.html'
      config.position = position;

      showPanel();
    }

    function navigation() {

      $rootScope.$broadcast('openNav');

      var position = $mdPanel.newPanelPosition()
        .relativeTo(target)
        .addPanelPosition($mdPanel.xPosition.OFFSET_END)
        .top()

      config.locals = { user: Auth.user };
      config.controller = userhomeController
      config.templateUrl = 'components/demo/navigation.html'
      config.position = position;

      $timeout(function () {
        $(target).addClass("highlight");
        showPanel();
      }, 500)
    }

    function universalSeach() {
      var position = $mdPanel.newPanelPosition()
        .relativeTo(target)
        .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.BELOW);

      config.controller = userhomeController
      config.templateUrl = 'components/demo/universal-search.html'
      config.position = position;

      $(target).addClass("highlight");

      showPanel();
    }

    function userSettings() {
      var position = $mdPanel.newPanelPosition()
        .relativeTo(target)
        .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.BELOW);

      config.controller = userhomeController
      config.templateUrl = 'components/demo/user-settings.html'
      config.position = position;

      $(target).addClass("highlight");

      showPanel();
    }

    return demoService;

  }]);
