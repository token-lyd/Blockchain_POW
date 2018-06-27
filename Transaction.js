"use strict";
exports.__esModule = true;
var utility_1 = require("./utility");
var Blockchain_1 = require("./Blockchain");
var js_sha256_1 = require("js-sha256");
var Transaction = /** @class */ (function () {
    function Transaction(from, to, amount, inputs) {
        this.inputs = [];
        this.outputs = [];
        this.sequence = 0; // a rough count of how many transactions have been generated.
        this.sender = from;
        this.recipient = to;
        this.value = amount;
        this.inputs = inputs;
    }
    // This Calculates the transaction hash (which will be used as its Id)
    Transaction.prototype.calculateHash = function () {
        this.sequence++; //increase the sequence to avoid 2 identical transactions having the same hash
        return js_sha256_1.sha256("" + this.sender + this.recipient + this.sequence);
    };
    //Signs all the data we dont wish to be tampered with.
    Transaction.prototype.generateSignature = function () {
        var input = "" + this.sender + this.recipient + this.value;
        this.signature = utility_1.Utility.applyECDSASig(input);
    };
    // Verifies the data we signed hasnt been tampered with
    Transaction.prototype.verifiySignature = function () {
        var input = "" + this.sender + this.recipient + this.value;
        return utility_1.Utility.verifyECDSASig(input, this.signature);
    };
    Transaction.prototype.processTransaction = function () {
        if (!this.verifiySignature()) {
            console.log("Transaction signature filed to verify.");
            return false;
        }
        this.inputs.forEach(function (input) {
            input.UTXO = Blockchain_1.Blockchain.UTXOs[input.transactionOutputId];
        });
        //check if transaction is valid:
        if (this.getInputsValue() < Blockchain_1.Blockchain.minimumTransaction) {
            console.log("#Transaction Inputs to small: " + this.getInputsValue());
            return false;
        }
        // generate transaction outputs
        var leftOver = this.getInputsValue() - this.value; //get value of inputs then the left over change
        this.transactionId = this.calculateHash();
        this.outputs.push(new TransactionOutput(this.recipient, this.value, this.transactionId)); // send value to recipient
        this.outputs.push(new TransactionOutput(this.sender, leftOver, this.transactionId)); // send the left over 'change' back to sender
        //add outputs to Unspent list
        this.outputs.forEach(function (output) {
            Blockchain_1.Blockchain.UTXOs[output.id] = output;
        });
        //remove transaction inputs from UTXO lists as spent
        this.inputs.forEach(function (input) {
            if (input.UTXO == undefined || input.UTXO == null) {
                return;
            }
            delete Blockchain_1.Blockchain.UTXOs[input.UTXO.id];
        });
        return true;
    };
    //returns sum of inputs(UTXOs) values
    Transaction.prototype.getInputsValue = function () {
        var total = 0;
        this.inputs.forEach(function (input) {
            if (input.UTXO == undefined || input.UTXO == null) {
                return;
            }
            total += input.UTXO.value;
        });
        return total;
    };
    // returns sum of outputs
    Transaction.prototype.getOutputsValue = function () {
        var total = 0;
        this.outputs.forEach(function (output) {
            total += output.value;
        });
        return total;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
// This class will be used to reference TransactionOutputs that have not yet been spent. 
// The transactionOutputId will be used to find the relevant TransactionOutput, allowing miners to check your ownership.
var TransactionInput = /** @class */ (function () {
    function TransactionInput(transactionOutputId) {
        this.transactionOutputId = transactionOutputId;
    }
    return TransactionInput;
}());
exports.TransactionInput = TransactionInput;
var TransactionOutput = /** @class */ (function () {
    function TransactionOutput(recipient, value, parentTransactionId) {
        this.recipient = recipient;
        this.value = value;
        this.parentTransactionId = parentTransactionId;
        this.id = js_sha256_1.sha256("" + recipient + value + parentTransactionId);
    }
    TransactionOutput.prototype.isMine = function (publicKey) {
        if (this.recipient == publicKey) {
            return true;
        }
        return false;
    };
    return TransactionOutput;
}());
exports.TransactionOutput = TransactionOutput;
/*var w = new Wallet();
console.log(w.publicKey, w.privateKey);

var t = new Transaction("1","2",3,[]);
var sign = t.applyECDSASig(w.keyPair, "nilay");
console.log(t.verifyECDSASig(w.keyPair, "nilay", sign))*/
