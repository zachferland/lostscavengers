
var test = function() {
    this.lw = require('./index')
    this.ks = new this.lw.keystore("talent there strike drink fringe brick drift kitchen garment time trend orchard", "hej")

    this.address = this.ks.generateNewAddress("hej")
    this.api = new this.lw.blockchainapi.blockappsapi()
    this.abi = [{"constant":false,"inputs":[{"name":"creator","type":"address"}],"name":"addCreator","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"challenges","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"creators","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"challenge","type":"address"}],"name":"addChallenge","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]
}

// create the contract
test.prototype.createContract = function(nonce, callback) {
    this.api.getNonce(this.address, function(_, nonce) {
        this.lw.helpers.sendCreateContractTx("60606040525b6001600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055505b61026e806100586000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900480633b9dce05146100655780638f1d377614610078578063933166e1146100a9578063d127c387146100c4578063f8242c32146100d957610063565b005b610076600480359060200150610152565b005b6100896004803590602001506100ec565b8073ffffffffffffffffffffffffffffffffffffffff1660005260206000f35b6100ba60048035906020015061012d565b8060005260206000f35b6100cf600450610124565b8060005260206000f35b6100ea6004803590602001506101d9565b005b600060005060205280600052604060002060009150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016000505481565b600260005060205280600052604060002060009150909054906101000a900460ff1681565b600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156101d5576001600260005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055505b5b50565b600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561026a57806000600050600060016000818150548092919060010191905055815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b5056",
            this.address,
            {"nonce": nonce}, this.api, this.ks, "hej",
            //callback)
            function(_, data) {console.log(data)})
    }.bind(this))
}

test.prototype.addChallenge = function (contractAddress, challengeAddress) {
    this.api.getNonce(this.address, function(_, nonce) {
        this.lw.helpers.sendFunctionTx(this.abi,
              contractAddress,
              "addChallenge", ["0x" + challengeAddress],
              this.address, { "nonce": nonce }, this.api, this.ks, "hej",
              function(err, data) { console.log(err, data) })
    }.bind(this))
}

test.prototype.addCreator = function (contractAddress, creatorAddress) {
    this.api.getNonce(this.address, function(_, nonce) {
        this.lw.helpers.sendFunctionTx(this.abi,
              contractAddress,
              "addCreator", [creatorAddress],
              this.address, { "nonce": nonce }, this.api, this.ks, "hej",
              function(err, data) { console.log(err, data) })
    }.bind(this))
}

module.exports = test;
