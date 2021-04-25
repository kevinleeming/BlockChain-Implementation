const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions = [], previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Proof-of-Work:
    // we want our hash output starting with certain amount of zero (000.....)
    // cause we can't decide the output of hash, so we have to try a lot of possibility to find out
    // this process called mining.
    miningBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }
    createGenesisBlock(){
        return new Block("2021/04/18", "Genesis Block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    /*addNewBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.miningBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/
    miningPendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.miningBlock(this.difficulty);

        console.log("Block successfully mined !");
        this.chain.push(block);
        // 
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    // Check whether blockchain is valid
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let ming = new BlockChain();

// Transactions come in
ming.createTransaction(new Transaction("Bob", "Alice", 100));
ming.createTransaction(new Transaction("Alice", "Bob", 50));

// Miner "Minggym" come in to mine
ming.miningPendingTransactions("Minggym");

console.log("Alice have " , ming.getBalanceOfAddress("Alice"));
console.log("Minggym have " , ming.getBalanceOfAddress("Minggym"));

/*
console.log("Mining Block1 ...");
ming.addNewBlock(new Block(1, "16:23", { amount: 4}));

console.log("Mining Block2 ...");
ming.addNewBlock(new Block(2, "16:24", { amount: 10}));
*/


//console.log('Is blockchain valid? ' + ming.isChainValid());
//console.log(JSON.stringify(ming, null, 4));
