(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'uiGmapgoogle-maps',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;


  // Services -------------------------------------------------





  //LightWallet (don't really have to do this )
  angular.module('application')
    .factory('lw', ['$window', function(window) {
      return window.ethlightjs
  }]);








  // LightWallet KeyStore
  angular.module('application')
    .factory('keystore', ['$window', '$rootScope', 'lw', function(window, rootScope, lw) {
      var keystore = this
      keystore.initialized = false;
      keystore.instance = undefined;
      //adding password for ease of use for the time being
      keystore.password = undefined;

      keystore.init = function(seed, password) {
        keystore.initalized = true;
        keystore.password = password
        keystore.instance = new lw.keystore(seed, password)
        keystore.generateAddressSet(keystore.password)

        // Set addresses globally for testing
        rootScope.addresses = keystore.instance.getAddresses()
        rootScope.address = rootScope.addresses[0]
      }

      keystore.initHuh = function(){
        return keystore.initialized;
      }

      keystore.saveLocalStorage = function() {
        var serializedLS = keystore.instance.serialize()
        window.localStorage.setItem('keystore', serializedLS)
        window.localStorage.setItem('password', keystore.password)
      }

      keystore.getLocalStorage = function() {
        var serialized = window.localStorage.getItem('keystore')
        var ksObject = lw.keystore.deserialize(serialized)
        keystore.password = window.localStorage.getItem('password')
        keystore.instance = ksObject
        //Maybe remove this after
        // keystore.generateAddressSet(keystore.password)
        // Set addresses globally for testing
        rootScope.addresses = keystore.instance.getAddresses()
        rootScope.address = rootScope.addresses[0]

        return ksObject
      }

      keystore.generateAddressSet = function() {
        var i;
        for (i = 0; i < 6; i++) {
          keystore.instance.generateNewAddress(keystore.password)
        }

        keystore.saveLocalStorage(keystore.password)
      }

      return keystore
  }]);







  //LightWallet (don't really have to do this )
  angular.module('application')
    .factory('challengeDatum', function() {
      var challengeDatum = this

      challengeDatum.challenges = {
        '99de3950a971bb26461477e333e75fdca7f44d34': { title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.626936', longitude: '-73.865685'}, date: '6/25/15'},
        '99de3950a971bb26461477e333e75fdca7f44d35': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.736936', longitude: '-73.965685'}, date: '6/25/15'},
        '99de3950a971bb26461477e333e75fdca7f44d36': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.616936', longitude: '-73.845685'}, date: '6/25/15'},
        '99de3950a971bb26461477e333e75fdca7f44d37': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.716936', longitude: '-73.975685'}, date: '6/25/15'},
        '99de3950a971bb26461477e333e75fdca7f44d38': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.636936', longitude: '-73.855685'}, date: '6/25/15'},
        '99de3950a971bb26461477e333e75fdca7f44d39': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.726936', longitude: '-73.955685'}, date: '6/25/15'}
      }

      return challengeDatum

  });







  // Modules ------------------------------------------------

  //Index module to allow address selection for testing
  angular.module('application')
    .controller('IndexCtrlr', ['$rootScope', '$window', 'keystore', function(scope, window, keystore) {

  }]);



  // Login module
  angular.module('application')
    .controller('LoginCtrlr', ['$location', '$window', 'keystore', function(location, window, keystore) {
      var login = this;

      login.createKeyStore = function() {
        keystore.init(login.seed, login.password)

        //save to local saveLocalStorage
        keystore.saveLocalStorage()
        window.console.log(keystore.instance)
        location.path('/challenges').replace();
      }

      var init = function() {
        if (window.localStorage.getItem('keystore') !== null) {
          // sets wallet from local storage
          keystore.getLocalStorage()
          window.console.log('Initialized keystore and pass from storage: ')
          window.console.log(keystore.instance)
          location.path('/challenges').replace();
        }
      }

      init()
    }]);








    // Challenges Controller
    angular.module('application')
      .controller('ChallengesCtrlr', ["$http", '$rootScope', "$location", 'challengeDatum', 'keystore', 'lw', function(http, rootScope, location, challengeDatum, keystore, lw) {
        var challenges = this;
        challenges.list = challengeDatum.challenges
        challenges.example = undefined

        rootScope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

        var init = function() {
          http.get('http://stablenet.blockapps.net/query/storage?address=99de3950a971bb26461477e333e75fdca7f44d34', {cache: true })
          .success(function(data) {
            challenges.example = data;
            // parse , loop through each item and append it to challenges.list
          })
        }

        challenges.goTo = function(address){
          location.path('/challenge/' + address).replace();
        }

        challenges.create = function() {

        }

        // return list of of individual values
        // var parse = function(jsonHex) {
        //   return jsonHex
        // }


        init()
      }]);







    // // Challenge Controller
    angular.module('application')
      .controller('ChallengeCtrlr', ["$http", "$location", '$state', 'challengeDatum', 'keystore', 'lw', function(http, location, state, challengeDatum, keystore, lw) {

        var address = state.params.id;
        var challenge = this;
        challenge.data = challengeDatum.challenges[address]

        challenge.submitSolution = function() {

          // check if solution is correct
          http.get('http://stablenet.blockapps.net/query/storage?address=99de3950a971bb26461477e333e75fdca7f44d34', {cache: true })
          .success(function(data) {
            // if true should congrats message update winner
            challenge.solutionMessage = "You got it"

            // if false try again message
            challenge.solutionMessage = "You did not get it"
          })
        }

    }]);









  // Example modules
  angular.module('application')
    .controller('TodoListController', function() {
      var todoList = this;
      todoList.todos = [
        {text:'learn angular', done:true},
        {text:'build an angular app', done:false}];

      todoList.addTodo = function() {
        todoList.todos.push({text:todoList.todoText, done:false});
        todoList.todoText = '';
      };

      todoList.remaining = function() {
        var count = 0;
        angular.forEach(todoList.todos, function(todo) {
          count += todo.done ? 0 : 1;
        });
        return count;
      };

      todoList.archive = function() {
        var oldTodos = todoList.todos;
        todoList.todos = [];
        angular.forEach(oldTodos, function(todo) {
          if (!todo.done) todoList.todos.push(todo);
        });
      };
    });











  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
