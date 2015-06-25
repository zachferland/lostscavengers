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


  // Services

  // LightWallet KeyStore
  angular.module('application')
    .factory('keystore', ['$window', function(window) {
      var keystore = this
      keystore.initialized = false;
      keystore.instance = undefined;

      keystore.init = function(seed, password) {
        keystore.initalized = true;
        keystore.instance = new window.ethlightjs.keystore(seed, password)

      }

      keystore.initHuh = function(){
        return keystore.initialized;
      }

      return keystore
  }]);

  // //LightWallet
  // angular.module('application')
  //   .factory('keystore', ['$window', function(win) {
  //     var LightWallet = ethlightjs
  //     keystore.initialized = false;
  //     keystore.instance = undefined;
  //
  //     keystore.init = function(seed, password) {
  //       keystore.initalized = true;
  //       keystore.instance = new windowethlightjs.keystore(seed, password)
  //     }
  //
  //     keystore.initHuh = function(){
  //       return keystore.initialized;
  //     }
  //
  //     return keystore
  // }]);


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







    // Login module

    angular.module('application')
      .controller('LoginCtrlr', ['$window', 'keystore', function(window, keystore) {
        var login = this;

        login.createKeyStore = function() {
          keystore.init(login.seed, login.password)
          window.console.log(keystore.instance)
        }

        // login.saveLocalStorage = function() {
        //   var serializedLS =
        // }

        // todoList.addTodo = function() {
        //   todoList.todos.push({text:todoList.todoText, done:false});
        //   todoList.todoText = '';
        // };
        //
        // todoList.remaining = function() {
        //   var count = 0;
        //   angular.forEach(todoList.todos, function(todo) {
        //     count += todo.done ? 0 : 1;
        //   });
        //   return count;
        // };
        //
        // todoList.archive = function() {
        //   var oldTodos = todoList.todos;
        //   todoList.todos = [];
        //   angular.forEach(oldTodos, function(todo) {
        //     if (!todo.done) todoList.todos.push(todo);
        //   });
        // };
      }]);










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
