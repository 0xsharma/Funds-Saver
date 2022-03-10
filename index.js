const Web3 = require('web3');
const abiDecoder = require('abi-decoder');

const Env = require('./env.json');
const MaticStakerABI = require('./MaticsStaker.abi');

abiDecoder.addABI(MaticStakerABI);

var web3 = new Web3(Web3.givenProvider || Env.polygonRPC);
const account1 = Env.account; 
const privateKey1 = Env.privateKey;

var nonce;

async function getNonce(){
    nonce = await web3.eth.getTransactionCount(account1);
    console.log("Nonce :  " + nonce)
}

async function main(){
    let MaticsStakerContract = await new web3.eth.Contract(MaticStakerABI, '0xda3f4d9509c1881f0661bc943db23024b7de2f82' );
    const networkId =  await web3.eth.net.getId();

    var tx = MaticsStakerContract.methods.withdraw();
    var gas = await tx.estimateGas({from: account1})
    var gasPrice = await web3.eth.getGasPrice();
    var data = tx.encodeABI();
    var nonce = await web3.eth.getTransactionCount(account1);
    

    var signedTx = await web3.eth.accounts.signTransaction(
        {
            to : '0xda3f4d9509c1881f0661bc943db23024b7de2f82',
            data,
            gas,
            gasPrice,
            nonce,
            chainId:networkId
        }, privateKey1
    );

    var receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    console.log(receipt);


    var balance = await web3.eth.getBalance(account1);
    nonce = await web3.eth.getTransactionCount(account1);
    var signedTx2 = await web3.eth.accounts.signTransaction(
        {
            from : Env.account,
            to : Env.account2,
            gas,
            gasPrice,
            nonce : nonce,
            chainId:networkId,
            value : web3.utils.toHex(balance)
        }, privateKey1
    );

    var receipt = await web3.eth.sendSignedTransaction(signedTx2.rawTransaction)
    console.log(receipt);
}

main
