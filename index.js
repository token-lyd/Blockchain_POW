i; /*mport { Wallet } from './Wallet';
import { Transaction, TransactionOutput, TransactionInput } from './Transaction';
import { Blockchain } from './Blockchain';
import { Block } from './Block';

// create new wallets
var walletA = new Wallet();
var walletB = new Wallet();
var coinbase = new Wallet();

//create genesis transaction, which sends 100 coins to walletA:
var genesisTransaction: Transaction = new Transaction(coinbase.publicKey, walletA.publicKey, 1000, []);
genesisTransaction.generateSignature();  //manually sign the genesis transaction
genesisTransaction.transactionId = "0";
genesisTransaction.outputs.push(new TransactionOutput(genesisTransaction.recipient, genesisTransaction.value, genesisTransaction.transactionId));

let firstOutput: TransactionOutput = genesisTransaction.outputs[0];
Blockchain.UTXOs[firstOutput.id] = firstOutput; //its important to store our first transaction in the UTXOs list.

console.log("Creating and Mining Genesis block... ");
var genesis = new Block("0");
genesis.addTransaction(genesisTransaction);
genesis.addBlock(genesis);*/
/*// test public and private keys
console.log("public and private keys: ");
console.log(walletA.publicKey, walletA.privateKey);

// Create a test transaction from WalletA to walletB
var tx = new Transaction(walletA.publicKey, walletB.publicKey, 5, []);
tx.generateSignature();

console.log("Is signature verified");
console.log(tx.verifiySignature());*/
