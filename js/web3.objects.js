const enableWalletButton = document.querySelector('.enableWallet');
const showSpot = document.getElementById('tokenSpot');
const selectedToken = document.getElementById('tokenSelected');

const optionQueryPremiumButton = document.querySelector('.queryPremium');
const showPremiumButton = document.querySelector('.queryPremium');
const showPremium = document.getElementById('option-premium');
const buyOptionButton = document.querySelector('.buyOption');
const showVol = document.getElementById('1d-vol');

const inputPoolInvest = document.getElementById('invest-mp');
const investInPool = document.getElementById('add-capital');
const withdrawFromPool = document.getElementById('withdraw-capital');

const inputType = document.getElementById('optionType');
const inputExpiry = document.getElementById('optionExpiry');
const inputStrike = document.getElementById('optionStrike');
const inputAmount = document.getElementById('optionAmount');

// Please change the following so initMarketMaker is called whenever 1)
inputStrike.addEventListener('focus', async() =>{

  const initMarketMaker =  async () =>{
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();

    const exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(selectedToken.value));
    const marketMakerAddress = await exchangeContract.methods.marketMakerAddress().call();
    console.log(marketMakerAddress);
    const marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", marketMakerAddress);
    const tokenAddress = await marketContract.methods.underlyingAddress().call();
    console.log(tokenAddress);
    const tokenContract = await getContract(web3, "./contracts/genericERC20.json", tokenAddress);

    await refreshSpot(web3, exchangeContract);
    console.log(accounts[0]);

    showPremiumButton.addEventListener('click', async () =>{
      const premium = await calcOptionPremium(web3, exchangeContract);
      console.log(premium);
      showPremium.innerHTML = premium;
      await showOptions(web3, marketContract, exchangeContract, accounts[0]);
    } )

    exchangeContract.events.newOptionBought({filter: {_purchaser: accounts[0]} },
       function(error, event){ console.log(event); })
       .on('data', function(returnValues){console.log(returnValues);}); // returnValues is the array of option information when it's purchased.

    buyOptionButton.addEventListener('click', async() => {
      await calcAndBuyOption(web3, exchangeContract, tokenContract, accounts[0]);
      await showOptions(web3,marketContract, exchangeContract, accounts[0]);
    })

    await showMarketCapital(web3, marketContract, exchangeContract);

    inputPoolInvest.addEventListener('focus', async() =>{
      await showPoolCost(web3, marketContract);
    })
    investInPool.addEventListener('click', async() => {
      await addCapital(web3,marketContract, tokenContract, accounts[0] );
    })
    withdrawFromPool.addEventListener('click', async() =>{
      await withdrawCapital(web3, marketContract, accounts[0]);
    })

    document.getElementById('invest-mp-unit').innerHTML = selectedToken.value;

    await showVolatility(web3, exchangeContract);


  }
  await initMarketMaker();

})


async function calcOptionPremium(web3, exchange) {
  const pricePricision = await exchange.methods.priceDecimals().call();

  var optionType = convertOptionType(inputType.options[inputType.selectedIndex].text);
  var optionExpiry = convertExpiry(inputExpiry.options[inputExpiry.selectedIndex].text);
  var optionStrike = web3.utils.toBN(web3.utils.toWei(inputStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  var optionAmount = web3.utils.toBN(web3.utils.toWei(inputAmount.value));

  console.log(optionExpiry);
  console.log(parseFloat(optionStrike));
  console.log(optionType);
  console.log(parseFloat(optionAmount));
  const premium = await exchange.methods.queryOptionCost(optionExpiry, optionStrike, optionAmount, optionType, 0).call();
  console.log(premium);
  return parseFloat(web3.utils.fromWei(web3.utils.toBN(premium))).toFixed(8);
}

async function calcAndBuyOption(web3, exchange, tokenContract, account) {
  const pricePricision = await exchange.methods.priceDecimals().call();

  var optionType = convertOptionType(inputType.options[inputType.selectedIndex].text);
  var optionExpiry = convertExpiry(inputExpiry.options[inputExpiry.selectedIndex].text);
  var optionStrike = web3.utils.toBN(web3.utils.toWei(inputStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  var optionAmount = web3.utils.toBN(web3.utils.toWei(inputAmount.value));

  const premium = await exchange.methods.queryOptionCost(optionExpiry, optionStrike, optionAmount , optionType, 0).call();
  console.log(premium);
  console.log(exchange._address);
  const approveSuccess = await tokenContract.methods.approve(exchange._address, premium).send({from:account, gas: 10**6});
  console.log(approveSuccess);
  if(approveSuccess){
    await exchange.methods.purchaseOption(optionExpiry, optionStrike, optionType, optionAmount, premium).send({from:account, gas: 10**6});
  }
}

async function showOptions(web3, market, exchange, account){
  const optionCount = await market.methods.getHoldersOptionCount(account).call();
  console.log(optionCount);
  for (let i = 0; i < optionCount; i++) {
    var option = await market.methods.getHoldersOption(i, account).call();
    var optionId = parseInt(option['id']);
    var optionPayoff = await exchange.methods.getOptionPayoffValue(optionId).call();
    // Please populate the section of 'Your current active contract' by adding more blocks
    // each of which contains the information specified below and an 'Exercise' button to link to the exerciseOption function
    document.getElementById('option-1').innerHTML = formatOptionMaturity(web3, option);
    document.getElementById('option-payoff-1').innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionPayoff))).toFixed(4) + ' ' + selectedToken.value;
    document.getElementById('option-amount-1').innerHTML = await formatOptionInfo(web3, exchange, option);

    exchange.events.optionExercised({filter: {_purchaser: account} },
       function(error, event){ console.log(event); })
       .on('data', function(returnValues){console.log(returnValues);}); // returnValues is the array of option information when it's purchased.

    // document.getElementById('option-exercise-1').addEventListener('click', async=>{
    //     await exchange.methods.exerciseOption(optionId).send({from: account});
    // })
  }
}

async function showMarketCapital(web3, market, exchange){
   var grossCapital = await market.methods.calcCapital(false, false).call();
   var capitalRatios = await exchange.methods.calcUtilisation(0, 0, 0).call();
   var callExposure = await market.methods.callExposure().call();
   var putExposure = await market.methods.putExposure().call();

   var netCapital = await market.methods.calcCapital(true, false).call();
   var totalSupply = await market.methods.totalSupply().call();
   var netAvgCapital = await market.methods.calcCapital(true,true).call();

   console.log(grossCapital);
   console.log(netCapital);
   console.log(totalSupply);
   console.log(netAvgCapital);

   document.getElementById('mp-gross-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital))).toFixed(4), selectedToken.value, "<small>", Number(parseFloat(web3.utils.fromWei(web3.utils.toBN(capitalRatios[0])))).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}), "</small>"].join(' ');
   document.getElementById('call-exposure').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(callExposure))).toFixed(4), selectedToken.value].join(' ');
   document.getElementById('put-exposure').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(putExposure))).toFixed(4), selectedToken.value].join(' ');

   document.getElementById('available-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(netCapital))).toFixed(4), selectedToken.value].join(' ');
   document.getElementById('mp-supply').innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(totalSupply))).toFixed(2);
   document.getElementById('average-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(netAvgCapital))).toFixed(4), selectedToken.value].join(' ');

}

async function showPoolCost(web3, market){
  var mpCost = await market.methods.calcCapital(false ,true).call();
    console.log(mpCost);
  var mpAmount = web3.utils.fromWei(web3.utils.toWei(web3.utils.toBN(web3.utils.toWei(inputPoolInvest.value))).div(web3.utils.toBN(mpCost)));
  console.log(mpAmount);
  document.getElementById('invest-mp-cost').innerHTML =parseFloat(mpAmount).toFixed(4);
}

async function addCapital(web3, market, tokenContract, account){
  var investAmount = web3.utils.toWei(inputPoolInvest.value);
  console.log(investAmount);
  const approveSuccess = await tokenContract.methods.approve(market._address, investAmount).send({from:account, gas: 10**6});
  console.log(approveSuccess);
  if(approveSuccess){
    await market.methods.addCapital(investAmount).send({from: account, gas: 10**6});
  }
}

async function withdrawCapital(web3, market, account){
  var mpWithdraw = web3.utils.toWei(document.getElementById('withdraw-mp').value);
  console.log(mpWithdraw);
  const approveSuccess = await market.methods.approve(market._address, mpWithdraw).send({from:account, gas: 10**6});
  console.log(approveSuccess);
  if(approveSuccess){
    await market.methods.withdrawCapital(mpWithdraw).send({from: account, gas: 10**6});
  }
}

async function showVolatility(web3, exchange){
  var vol = await exchange.methods.queryVol(web3.utils.toBN(86400)).call();
  console.log(vol);
  var volDecimals = await exchange.methods.priceDecimals().call();
  var volString = await (parseFloat(web3.utils.fromWei(web3.utils.toBN(vol[0]).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(volDecimals))))))).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
  console.log(volString);
  document.getElementById('1d-vol').innerHTML= volString;
}




async function formatOptionInfo(web3, exchange, optionInfo){
  let poType;
  switch(parseInt(optionInfo['poType'])){
    case 0:
      poType = "Call";
      break;
    case 1:
      poType = "Put";
      break;
    default:
      poType = "Undefined";
  }

  var precision = await exchange.methods.priceDecimals().call();
  var strike = web3.utils.fromWei(web3.utils.toBN(optionInfo['strike']).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(precision)))), 'ether');
  var amount = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionInfo['amount']))).toFixed(4);

  return [amount, selectedToken.value, poType, 'at' , parseFloat(strike).toFixed(4)].join(' ');
}

function formatOptionMaturity(web3, optionInfo){
  var maturityTime = parseInt(optionInfo['effectiveTime']) + parseInt(optionInfo['tenor']);
  var maturity = new Date();
  maturity.setTime(maturityTime * 1000);

  return maturity.toUTCString();
}


const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // ask user permission to access his accounts
          window.ethereum.request({ method: "eth_requestAccounts" });

          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      else if (window.web3)
      {
        const web3 = window.web3;
        resolve(web3);
      }
      else {
        // const provider = Web3.providers.HttpProvider("https://kovan.infura.io/v3/29da8f7c7cfc4593a4a29568124669a7");
        // const web3 = new Web3(provider);
        console.log("No MetaMask installed. please install MetaMask.");
      }
    });
  });
};

const refreshSpot = async (web3, exchange)=>{
  const price = await exchange.methods.queryPrice().call();
  const pricePrecision = await exchange.methods.priceDecimals().call();
  console.log(price);

  const spotText = web3.utils.fromWei(web3.utils.toBN(Number(price[0])).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePrecision)))), 'ether');
  showSpot.innerHTML =  parseFloat(spotText).toFixed(5);
}

const refreshVolatility = async (web3, market, exchange)=>{
  const vol = await exchange.methods.queryVol().call();
  const volPrecision = await exchange.methods.priceDecimals().call();

  showVol.innerHTML = Number(parseFloat(web3.utils.fromWei(web3.utils.toBN(Number(vol)).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(volPrecision)))), 'ether'))/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
}

const getContract = async (web3, path, address) => {
  const data = await $.getJSON(path);

  // const netId = await web3.eth.net.getId();
  // const deployedNetwork = data.networks[netId];

  const contract = new web3.eth.Contract(
    data.abi,
    address
  );
  return contract;
};

function convertOptionType(typeString) {
  switch(typeString) {
    case "Call":
      return 0;
      break;
    case "Put":
      return 1;
      break;
    default:
      return -1;
  }
}

function convertExpiry(expiryString) {
  switch(expiryString) {
    case "1 day":
      return 86400;
      break;
    case "1 week":
      return 7 * 86400;
      break;
    default:
      return 0;
  }
}

const getExchangeAddress = (tokenName) => {
  switch(tokenName) {
    case "MATIC":
      return "0x5C7d29A315E0760939F224BC5A181fC1612F9E6C";
      break;
    case "ETH":
      return "0x0Ac7e78f7A92F2BBd9D2709fF31e039da2D356eC";
      break;
    case "LINK":
      return "0xf6a5a85f32AC1022Fd7D39007827DAF9772E5495";
      break;
    default:
      return -1;
  }
}
