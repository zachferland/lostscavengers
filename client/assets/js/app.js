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
    .factory('abi', ['$window', function(window) {
        var abi = this
        abi.challenge = [{"constant":true,"inputs":[],"name":"lng","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"password","type":"bytes32"}],"name":"check","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"title","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"lat","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_title","type":"bytes32"},{"name":"_hint","type":"bytes32"},{"name":"_lat","type":"bytes32"},{"name":"_lng","type":"bytes32"}],"name":"setChallenge","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"hint","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"inputs":[],"type":"constructor"}]
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


      challengeDatum.challenges = {}
      // challengeDatum.challenges = {
      //   '99de3950a971bb26461477e333e75fdca7f44d34': { title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.626936', longitude: '-73.865685'}, date: '6/25/15'},
      //   '99de3950a971bb26461477e333e75fdca7f44d35': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.736936', longitude: '-73.965685'}, date: '6/25/15'},
      //   '99de3950a971bb26461477e333e75fdca7f44d36': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.616936', longitude: '-73.845685'}, date: '6/25/15'},
      //   '99de3950a971bb26461477e333e75fdca7f44d37': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.716936', longitude: '-73.975685'}, date: '6/25/15'},
      //   '99de3950a971bb26461477e333e75fdca7f44d38': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.636936', longitude: '-73.855685'}, date: '6/25/15'},
      //   '99de3950a971bb26461477e333e75fdca7f44d39': {  title: "The Lost Scavengers", description: "There exists and a place with not light and a message", winner: undefined, coords: {latitude: '40.726936', longitude: '-73.955685'}, date: '6/25/15'}
      // }

      return challengeDatum

  });







  // Modules ------------------------------------------------

  //Index module to allow address selection for testing
  angular.module('application')
    .controller('IndexCtrlr', ['$location', '$rootScope', '$window', 'keystore', function(location, scope, window, keystore) {
      var index = this

      index.login = function () {
        location.path('/login').replace();
      }


      // <form ng-submit="index.login()">

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



    angular.module('application')
      .controller('CreatorCtrlr', ["$http", '$rootScope', '$window', "$location", 'challengeDatum', 'keystore', 'lw', 'api', 'abi', function(http, rootScope, window, location, challengeDatum, keystore, lw, api, abi) {
        var creator = this;

        creator.address = '66233da500a04ab480d563dd226d41be7e89ca4a'

        creator.addCreator = function() {
             //window.console.log(rootScope.address)
            api.getNonce(rootScope.address, function(_, nonce) {
                window.console.log(nonce)
                creator._addCreator(nonce, creator.newAddress)
            })
        }

        creator._addCreator = function (nonce, address) {
            window.console.log("adding creator: " + address)
            lw.helpers.sendFunctionTx(abi.challengeList,
                  creator.address,
                  "addCreator", ['0x' + address],
                  rootScope.address, { "nonce": nonce }, api,
                  keystore.instance, keystore.password,
                  function(err, data) {
                      console.log(err, data)
                  }
            )
        }

        creator.createChallenge = function() {
            //window.console.log('hello')
             window.console.log(rootScope.address)
            api.getNonce(rootScope.address, function(_, nonce) {
                window.console.log(nonce)
                creator._createContract(nonce, function(err, addr) {
                    var hash = creator._sha3(creator.new.key)
                    window.console.log("Contract address: " + addr + " " + hash)
                    creator._setChallenge(++nonce, addr, hash,
                                             creator.new.title,
                                             creator.new.hint,
                                             rootScope.map.lat.toString(),
                                             rootScope.map.long.toString(),
                                             function() {
                      creator._addChallenge(++nonce, addr)
                    })
                })
            })
        }

        creator._sha3 = function(str) {
            var hex = CryptoJS.enc.Utf8.parse(str).toString()
            var len = 64 - hex.length
            hex = hex + new Array(len+1).join('0')
            var wordArray = CryptoJS.enc.Hex.parse(hex)

            return CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString(CryptoJS.enc.Latin1)
        }

        creator._createContract = function(nonce, callback) {
            lw.helpers.sendCreateContractTx("60606040525b33600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61029a806100406000396000f3006060604052361561008a576000357c010000000000000000000000000000000000000000000000000000000090048063015e72ec1461008c57806309bd5a60146100a1578063399e0792146100b65780634a79d50c146100c957806355d576cc146100de5780636aefb2d0146100f3578063dfbf53ae1461011e578063fbf552db146101495761008a565b005b61009760045061015e565b8060005260206000f35b6100ac6004506101a8565b8060005260206000f35b6100c7600480359060200150610242565b005b6100d4600450610196565b8060005260206000f35b6100e960045061018d565b8060005260206000f35b61011c6004803590602001803590602001803590602001803590602001803590602001506101b1565b005b610129600450610167565b8073ffffffffffffffffffffffffffffffffffffffff1660005260206000f35b61015460045061019f565b8060005260206000f35b60046000505481565b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60036000505481565b60016000505481565b60026000505481565b60006000505481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561023a5784600060005081905550836001600050819055508260026000508190555081600360005081905550806004600050819055505b5b5050505050565b60008160405180828152602001915050604051809103902090508060006000505414156102955733600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b505056",
                rootScope.address,
                {"nonce": nonce}, api,
                keystore.instance, keystore.password,
                callback)
        }

        creator._setChallenge = function (nonce, contractAddress, hash,
                                             title, hint, lat, lng, callback) {
            window.console.log("hash: " + hash + " hint: " + hint)
            lw.helpers.sendFunctionTx(abi.challenge,
                  contractAddress,
                  "setChallenge", [hash, title, hint, lat, lng],
                  rootScope.address, { "nonce": nonce }, api,
                  keystore.instance, keystore.password,
                  callback)
        }

        creator._addChallenge = function (nonce, challengeAddress) {
            lw.helpers.sendFunctionTx(abi.challengeList,
                  creator.address,
                  "addChallenge", ["0x" + challengeAddress],
                  rootScope.address, { "nonce": nonce },
                  api, keystore.instance, keystore.password,
                  function(err, data) { console.log(err, data) })
        }
      }])





    // Challenges Controller
    angular.module('application')
      .controller('ChallengesCtrlr', ["$http", '$rootScope', '$window', "$location", 'challengeDatum', 'keystore', 'lw', 'api', 'abi', function(http, rootScope, window, location, challengeDatum, keystore, lw, api, abi) {
        var challenges = this;
        challenges.list = challengeDatum.challenges
        challenges.example = undefined
        challenges.addressList = []

        rootScope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

        var init = function() {

          // Create Map
          rootScope.map = {
            long: " click on map ",
            lat: '',
            center: {
              latitude: 40.7157774,
              longitude: -73.961849
            },
            zoom: 14,
            events: {
              click: function(mapModel, eventName, originalEventArgs) {
                rootScope.map.lat = originalEventArgs[0].latLng.A
                rootScope.map.long = originalEventArgs[0].latLng.F
              }
            }

          };

          // Get address of every challenge contract from registry contract
          challenges.address = '66233da500a04ab480d563dd226d41be7e89ca4a'
          http.get('http://stablenet.blockapps.net/query/storage?address=' + challenges.address, {cache: false })
          .success(function(data) {
            challenges.example = data

            data.forEach(function(entry) {
              if (entry.value !== "0000000000000000000000000000000000000000000000000000000000000001"){
                // address last 40 char of 64 char string
                challenges.addressList.push(entry.value.substring(24))
              }
            });

            // Now get data for every challenge
            challenges.addressList.forEach(function(address) {
              http.get('http://stablenet.blockapps.net/query/storage?address=' + address, {cache: false })
              .success(function(data) {

                var winner = 'none'
                if (data[6]) {
                  winner = data[6].value.substring(24)
                }

                //  '99de3950a971bb26461477e333e75fdca7f44d34':
                // parse here and a
                challengeDatum.challenges[address] = {title: challenges._hexstrToStr(data[1].value),
                description: challenges._hexstrToStr(data[2].value),
                winner: winner,
                coords: {latitude: challenges._hexstrToStr(data[3].value),
                        longitude: challenges._hexstrToStr(data[4].value)},
                date: '6/25/15'}

                // challenges.list = challengeDatum.challenges
              });

            });

            challenges.example = challenges.addressList
          })
        }

        challenges._hexstrToStr = function(hex) {
            return CryptoJS.enc.Hex.parse(hex).toString(CryptoJS.enc.Utf8).replace(/\u0000/g, "")
        }

        challenges.goTo = function(address){
          location.path('/challenge/' + address).replace();
        }

        // return list of of individual values
        // var parse = function(jsonHex) {
        //   return jsonHex
        // }


        init()
      }]);







    // // Challenge Controller
    angular.module('application')
      .controller('ChallengeCtrlr', ["$http", "$location", '$rootScope', '$window', '$state', 'challengeDatum', 'keystore', 'lw', 'abi', 'api', function(http, location, rootScope, window, state, challengeDatum, keystore, lw, abi, api) {

        var address = state.params.id;
        var challenge = this;
        challenge.data = challengeDatum.challenges[address]

        window.console.log("yo")

        challenge.submitSolution = function() {
          window.console.log("yo")

          challenge._submitAnswer(address, challenge.solution)

          // check if solution is correct
          // http.get('http://stablenet.blockapps.net/query/storage?address=99de3950a971bb26461477e333e75fdca7f44d34', {cache: true })
          // .success(function(data) {
          //   // if true should congrats message update winner
          //   challenge.solutionMessage = "You got it"
          //
          //   // if false try again message
          //   challenge.solutionMessage = "You did not get it"
          // })
        }

        challenge._submitAnswer = function(contractAddress, pw) {
            window.console.log(contractAddress + " " + pw)
            api.getNonce(rootScope.address, function(_, nonce) {
              window.console.log(nonce)
                lw.helpers.sendFunctionTx(abi.challenge,
                      contractAddress,
                      "check", [pw],
                      rootScope.address, { "nonce": nonce },
                      api, keystore.instance, keystore.password,
                      function(err, data) { window.console.log(err, data) })
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
