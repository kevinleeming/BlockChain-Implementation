const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
    }
    createGenesisBlock(){
        return new Block(0, "2021/04/18", "Genesis Block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    addNewBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.miningBlock(this.difficulty);
        this.chain.push(newBlock);
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

console.log("Mining Block1 ...");
ming.addNewBlock(new Block(1, "16:23", { amount: 4}));

console.log("Mining Block2 ...");
ming.addNewBlock(new Block(2, "16:24", { amount: 10}));

//console.log('Is blockchain valid? ' + ming.isChainValid());
//console.log(JSON.stringify(ming, null, 4));
