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


  //api
  angular.module('application')
    .factory('api', ['$window', 'lw', function(window, lw) {
      return new lw.blockchainapi.blockappsapi()
  }]);

  //abis
  angular.module('application')
    .factory('api', ['$window', function(window) {
        var abi = this
        abi.challenge = [{"constant":false,"inputs":[{"name":"password","type":"bytes32"}],"name":"check","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"challengeHint","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"challengeHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"test2","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"hint","type":"bytes32"}],"name":"setChallenge","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"pw","type":"bytes32"}],"name":"gethash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"test","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"inputs":[],"type":"constructor"}]
        abi.challengeList = [{"constant":false,"inputs":[{"name":"creator","type":"address"}],"name":"addCreator","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"challenges","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"creators","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"challenge","type":"address"}],"name":"addChallenge","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]
      return abi
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
      .controller('ChallengesCtrlr', ["$http", '$rootScope', "$location", 'challengeDatum', 'keystore', 'lw', 'api', 'abi', function(http, rootScope, location, challengeDatum, keystore, lw, api, abi) {
        var challenges = this;
        challenges.list = challengeDatum.challenges
        challenges.example = undefined
        challenges.addressList = []

        rootScope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

        var init = function() {

          // Get address of every challenge contract from registry contract
          challenges.address = '70e89ffe227dc02db70024b29ad7e16a00111ff9'
          http.get('http://stablenet.blockapps.net/query/storage?address=' + challenges.address, {cache: true })
          .success(function(data) {
            challenges.example = data

            data.forEach(function(entry) {
              if (entry.value !== "0000000000000000000000000000000000000000000000000000000000000001"){
                // address last 40 char of 64 char string
                challenges.addressList.push(entry.value.substring(24))
              }
            });

            // Now get data for every challenge
            // challenges.addressList.forEach(function(address) {
            //   http.get('http://stablenet.blockapps.net/query/storage?address=' + address, {cache: true })
            //   .success(function(data) {
            //     // parse here and a
            //
            //   });
            //
            // });
            //
            // challenges.example = challenges.addressList

          })




        }

        challenges.goTo = function(address){
          location.path('/challenge/' + address).replace();
        }

        challenges.create = function(name, hint, password) {
            api.getNonce(rootScope.address, function(_, nonce) {
                challenges._createContract(nonce, function(err, addr) {
                    var hash = challenges._sha3(password)
                    challenges._setChallenge(++nonce, addr, hash, hint)
                    console.log("Contract address: " + addr)
                })
            })
            // TODO - add to challengeList
        }

        challenges._sha3 = function(str) {
            var hex = CryptoJS.enc.Utf8.parse(str).toString()
            var len = 64 - hex.length
            hex = hex + new Array(len+1).join('0')
            var wordArray = CryptoJS.enc.Hex.parse(hex)

            return CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString(CryptoJS.enc.Latin1)
        }

        challenges._createContract = function(nonce, callback) {
            lw.helpers.sendCreateContractTx("60606040525b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6101e6806100406000396000f30060606040526000357c010000000000000000000000000000000000000000000000000000000090048063399e0792146100655780633f696821146100785780635b8b22801461008d578063789237c1146100a2578063dfbf53ae146100bb57610063565b005b61007660048035906020015061018e565b005b6100836004506100e6565b8060005260206000f35b6100986004506100ef565b8060005260206000f35b6100b960048035906020018035906020015061011e565b005b6100c66004506100f8565b8073ffffffffffffffffffffffffffffffffffffffff1660005260206000f35b60016000505481565b60006000505481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156101895781600060005081905550806001600050819055505b5b5050565b60008160405180828152602001915050604051809103902090508060006000505414156101e15733600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b505056",
                rootScope.address,
                {"nonce": nonce}, api,
                keystore.instance, keystore.password,
                callback)
        }

        challenges._setChallenge = function (nonce, contractAddress, hash, hint) {
            lw.helpers.sendFunctionTx(abi.challenge,
                  contractAddress,
                  "setChallenge", [hash, hint],
                  rootScope.address, { "nonce": nonce }, api,
                  keystore.instance, keystore.password,
                  function(err, data) { console.log(err, data) })
        }

        callenges._addChallenge = function (nonce, challengeAddress) {
            this.lw.helpers.sendFunctionTx(abi.challengeList,
                  challenges.address,
                  "addChallenge", ["0x" + challengeAddress],
                  rootScope.address, { "nonce": nonce },
                  api, keystore.instance, keystore.password,
                  function(err, data) { console.log(err, data) })
        }

        // return list of of individual values
        // var parse = function(jsonHex) {
        //   return jsonHex
        // }


        init()
      }]);







    // // Challenge Controller
    angular.module('application')
      .controller('ChallengeCtrlr', ["$http", "$location", '$state', 'challengeDatum', 'keystore', 'lw', 'abi', function(http, location, state, challengeDatum, keystore, lw, abi) {

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

        challenge._submitAnswer = function(contractAddress, pw) {
            api.getNonce(this.address, function(_, nonce) {
                lw.helpers.sendFunctionTx(abi.challenge,
                      contractAddress,
                      "check", [pw],
                      rootScope.address, { "nonce": nonce },
                      api, keystore.instance, keystore.password,
                      function(err, data) { console.log(err, data) })
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
