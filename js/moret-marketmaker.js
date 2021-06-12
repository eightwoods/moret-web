if(typeof web3 !== 'undefined'){
  web3 = new Web3(web3.currentProvider);
}
else {
  web3 = new Web3(new Web3.providers.HttpProviders("https://kovan.infura.io/v3/8b982c2ec1ba43b289f10b475994cc9f"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];
