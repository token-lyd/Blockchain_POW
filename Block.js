"use strict";
exports.__esModule = true;
var merkle_1 = require("./merkle");
var js_sha256_1 = require("js-sha256");
var Block = /** @class */ (function () {
    function Block(previousHash) {
        this.transactions = [];
        this.nonce = 0;
        this.previousHash = previousHash;
        this.timestamp = Date.now();
        this.hash = this.calculateHash(); //Making sure we do this after we set the other values.
    }
    //Calculate new hash based on blocks contents
    Block.prototype.calculateHash = function () {
        var calculatedHash = "" + this.merkleRoot + this.previousHash + this.timestamp + this.nonce;
        return js_sha256_1.sha256(calculatedHash);
    };
    //Increases nonce value until hash target is reached.
    Block.prototype.mineBlock = function (difficulty) {
        this.merkleRoot = merkle_1.Merkle.getMerkleRoot(this.transactions);
        var target = Array(difficulty + 1).join("0");
        console.log(this.hash);
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    };
    // Add transaction to this block
    Block.prototype.addTransaction = function (transaction) {
        if (transaction == undefined) {
            return false;
        }
        if (this.previousHash != "0") {
            if (!transaction.processTransaction()) {
                console.log("Transaction failed to process.");
                return false;
            }
        }
        this.transactions.push(transaction);
        return true;
    };
    return Block;
}());
exports.Block = Block;
/*let genesisBlock = new Block("Hi im the first block", "0");
console.log("Hash for block 1 : " + genesisBlock.hash);

let secondBlock = new Block("Yo im the second block", genesisBlock.hash);
console.log("Hash for block 2 : " + secondBlock.hash);

let thirdBlock = new Block("Hey im the third block", secondBlock.hash);
console.log("Hash for block 3 : " + thirdBlock.hash);*/ 
