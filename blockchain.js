const SHA256 = require('crypto-js/sha256');
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){ // signingKey is a pair of public key and private key
        if(this.fromAddress !== signingKey.getPublic('hex')){
            throw new Error("You cannot sign transaction for other wallet.");
        }

        let txHash = this.calculateHash();
        let sig = signingKey.sign(txHash, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        // Transaction of miner reward
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error("No signature in this transaction.");
        }
        
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        // Giving reward to miner 
        this.pendingTransactions.push(new Transaction(null, miningRewardAddress, this.miningReward));

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.miningBlock(this.difficulty);

        console.log("Block successfully mined !");
        this.chain.push(block);

        this.pendingTransactions = [];
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

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;