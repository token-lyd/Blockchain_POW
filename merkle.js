"use strict";
exports.__esModule = true;
var js_sha256_1 = require("js-sha256");
var Merkle = /** @class */ (function () {
    function Merkle() {
    }
    Merkle.getMerkleRoot = function (hashes) {
        var _this = this;
        var concatHashes = [];
        // if the no of elements is odd, append the last element in array
        // to make the hashes array even
        if (hashes.length % 2 == 1) {
            hashes.push(hashes[hashes.length - 1]);
        }
        // concat hashes in a pair of 2
        for (var i = 0; i < hashes.length; i += 2) {
            concatHashes.push(hashes[i] + hashes[i + 1]);
        }
        // pass the concatanated hashes through double hash
        var cH = concatHashes.map(function (hash) { return _this.doubleHash(hash); });
        if (cH.length > 1) {
            this.getMerkleRoot(cH);
        }
        else {
            return cH[0];
        }
    };
    Merkle.doubleHash = function (hash) {
        return js_sha256_1.sha256(js_sha256_1.sha256(hash)).toString();
    };
    return Merkle;
}());
exports.Merkle = Merkle;
