(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

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
    .factory('keystore', ['$window', 'lw', function(window, lw) {
      var keystore = this
      keystore.initialized = false;
      keystore.instance = undefined;
      //adding password for ease of use for the time being
      keystore.password = undefined;

      keystore.init = function(seed, password) {
        keystore.initalized = true;
        keystore.instance = new lw.keystore(seed, password)
      }

      keystore.initHuh = function(){
        return keystore.initialized;
      }

      keystore.saveLocalStorage = function(password) {
        var serializedLS = keystore.instance.serialize()
        window.localStorage.setItem('keystore', serializedLS)
        window.localStorage.setItem('password', password)
      }

      keystore.getLocalStorage = function() {
        var serialized = window.localStorage.getItem('keystore')
        var ksObject = lw.keystore.deserialize(serialized)
        keystore.password = window.localStorage.getItem('password')
        keystore.instance = ksObject
        return ksObject
      }

      return keystore
  }]);


  // Modules ------------------------------------------------


  // Login module

  angular.module('application')
    .controller('LoginCtrlr', ['$location', '$window', 'keystore', function(location, window, keystore) {
      var login = this;

      login.createKeyStore = function() {
        keystore.init(login.seed, login.password)

        //save to local saveLocalStorage
        keystore.saveLocalStorage(login.password)
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
      .controller('ChallengesCtrlr', ['keystore', 'lw', function(keystore, lw) {
        var challenges = this;


      }]);


    // Challenge Controller
    angular.module('application')
      .controller('ChallengeCtrlr', ['keystore', 'lw', function(keystore, lw) {
        var challenge = this;


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
