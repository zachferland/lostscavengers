
var CryptoJS = require('crypto-js')

var test = function() {
    this.lw = require('./index')
    this.ks = new this.lw.keystore("talent there strike drink fringe brick drift kitchen garment time trend orchard", "hej")

    this.address = this.ks.generateNewAddress("hej")
    this.api = new this.lw.blockchainapi.blockappsapi()
    this.abi = [{"constant":false,"inputs":[{"name":"password","type":"bytes32"}],"name":"check","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"challengeHint","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"challengeHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"test2","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"hint","type":"bytes32"}],"name":"setChallenge","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"pw","type":"bytes32"}],"name":"gethash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"test","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"inputs":[],"type":"constructor"}]
}

// create the contract
test.prototype.createContract = function(nonce, callback) {
    return this.lw.helpers.sendCreateContractTx("60606040525b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6101e6806100406000396000f30060606040526000357c010000000000000000000000000000000000000000000000000000000090048063399e0792146100655780633f696821146100785780635b8b22801461008d578063789237c1146100a2578063dfbf53ae146100bb57610063565b005b61007660048035906020015061018e565b005b6100836004506100e6565b8060005260206000f35b6100986004506100ef565b8060005260206000f35b6100b960048035906020018035906020015061011e565b005b6100c66004506100f8565b8073ffffffffffffffffffffffffffffffffffffffff1660005260206000f35b60016000505481565b60006000505481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156101895781600060005081905550806001600050819055505b5b5050565b60008160405180828152602001915050604051809103902090508060006000505414156101e15733600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b505056",
        this.address,
        {"nonce": nonce}, this.api, this.ks, "hej",
        callback)
        //function(_, data) {console.log(data)};
}

test.prototype.setChallenge = function (nonce, contractAddress, hash) {
    this.lw.helpers.sendFunctionTx(this.abi,
          contractAddress,
          "setChallenge", [hash, "this is the hint"],
          this.address, { "nonce": nonce }, this.api, this.ks, "hej",
          function(err, data) { console.log(err, data) })
}

test.prototype.check = function(contractAddress, pw) {
    this.api.getNonce(this.address, function(_, nonce) {
        this.lw.helpers.sendFunctionTx(this.abi,
              contractAddress,
              "check", [pw],
              this.address, { "nonce": nonce }, this.api, this.ks, "hej",
              function(err, data) { console.log(err, data) })
    }.bind(this))
}

test.prototype.all = function(hash) {
    this.api.getNonce(this.address, function(_, nonce) {
        this.createContract(nonce, function(_, addr) {
                this.setChallenge(++nonce, addr, hash)
                console.log("Contract address: " + addr)
        }.bind(this))
    }.bind(this))
}

test.prototype.hash = function(str) {
    var hex = CryptoJS.enc.Utf8.parse(str).toString()
    var len = 64 - hex.length
    hex = hex + new Array(len+1).join('0')
    var wordArray = CryptoJS.enc.Hex.parse(hex)

    return CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString(CryptoJS.enc.Latin1)
}

test.prototype.hexstrToStr = function(hex) {
    return CryptoJS.enc.Hex.parse(hex).toString(CryptoJS.enc.Utf8).replace(/\u0000/g, "")
}

module.exports = test;
