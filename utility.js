"use strict";
exports.__esModule = true;
var bitcoin = require("bitcoinjs-lib");
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.applyECDSASig = function (input) {
        return this.keyPair.sign(bitcoin.crypto.sha256(input));
    };
    Utility.verifyECDSASig = function (input, sign) {
        return this.keyPair.verify(bitcoin.crypto.sha256(input), sign);
    };
    return Utility;
}());
exports.Utility = Utility;
