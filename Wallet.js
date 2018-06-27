"use strict";
exports.__esModule = true;
var bitcoin = require("bitcoinjs-lib");
var utility_1 = require("./utility");
var Blockchain_1 = require("./Blockchain");
var Transaction_1 = require("./Transaction");
var Wallet = /** @class */ (function () {
    function Wallet() {
        this.UTXOs = {};
        this.generateKeyPair();
    }
    Wallet.prototype.generateKeyPair = function () {
        var keyPair = bitcoin.ECPair.makeRandom();
        this.publicKey = keyPair.getAddress();
        this.privateKey = keyPair.toWIF();
        utility_1.Utility.keyPair = keyPair;
    };
    Wallet.prototype.getBalance = function () {
        var total = 0;
        for (var prop in Blockchain_1.Blockchain.UTXOs) {
            var utxo = Blockchain_1.Blockchain.UTXOs[prop];
            if (utxo.isMine(this.publicKey)) {
                this.UTXOs[utxo.id] = utxo; //add it to our list of unspent transactions
                total += utxo.value;
            }
        }
        return total;
    };
    Wallet.prototype.sendFunds = function (recipient, value) {
        var _this = this;
        if (value > this.getBalance()) {
            console.log("#Not Enough funds to send transaction. Transaction Discarded.");
            return;
        }
        var inputs = [];
        var total = 0;
        for (var prop in this.UTXOs) {
            var utxo = this.UTXOs[prop];
            total += utxo.value;
            inputs.push(new Transaction_1.TransactionInput(utxo.id));
            if (total > value)
                break;
        }
        var tx = new Transaction_1.Transaction(this.publicKey, recipient, value, inputs);
        tx.generateSignature();
        //remove transaction inputs from UTXO lists as spent
        inputs.forEach(function (input) {
            delete _this.UTXOs[input.transactionOutputId];
        });
        return tx;
    };
    return Wallet;
}());
exports.Wallet = Wallet;
/*var w = new Wallet();
console.log(w.publicKey, w.privateKey);*/ 
