const {BlockChain, Transaction} = require("./blockchain.js");

let ming = new BlockChain();

// Transactions come in
ming.createTransaction(new Transaction("Bob", "Alice", 100));
ming.createTransaction(new Transaction("Alice", "Bob", 50));

// Miner "Minggym" come in to mine
ming.miningPendingTransactions("Minggym");

console.log("Alice have " , ming.getBalanceOfAddress("Alice"));
console.log("Minggym have " , ming.getBalanceOfAddress("Minggym"));

ming.miningPendingTransactions("Minggym");

console.log("Minggym have " , ming.getBalanceOfAddress("Minggym"));
/*
console.log("Mining Block1 ...");
ming.addNewBlock(new Block(1, "16:23", { amount: 4}));

console.log("Mining Block2 ...");
ming.addNewBlock(new Block(2, "16:24", { amount: 10}));
*/


//console.log('Is blockchain valid? ' + ming.isChainValid());
//console.log(JSON.stringify(ming, null, 4));
