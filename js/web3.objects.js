// Form
const optionToken = document.getElementById('tokenSelected');
const optionType = document.getElementById('optionType');
const optionExpiry = document.getElementById('optionExpiry');
const optionStrike = document.getElementById('optionStrike');
const optionAmount = document.getElementById('optionAmount');

// spot & premium
const spotPrice = document.getElementById('tokenSpot');
const premiumPrice = document.getElementById('option-premium');

// buttons
const purchaseButton = document.querySelector('.buyOption');
const quoteButton = document.querySelector('.queryPremium');

// Options
const optionList = document.getElementById('option-list');

// Vol
const showVol = document.getElementById('1d-vol');

// Pool
const inputPoolInvest = document.getElementById('invest-mp');
const investInPool = document.getElementById('add-capital');
const withdrawFromPool = document.getElementById('withdraw-capital');

// Hao
let refreshSpotPoller
let exchangeContract
let marketContract
let tokenContract

// Init
const initMarketMaker =  async () => {

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  console.log('account', accounts[0]);

  exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(optionToken.value));
  console.log('exchangeContract', exchangeContract);
  const marketMakerAddress = await exchangeContract.methods.marketMakerAddress().call();
  console.log('marketMakerAddress', marketMakerAddress);
  marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", marketMakerAddress);
  const tokenAddress = await marketContract.methods.underlyingAddress().call();
  console.log('tokenAddress', tokenAddress);
  tokenContract = await getContract(web3, "./contracts/genericERC20.json", tokenAddress)

  refreshSpot(web3, exchangeContract);

  // Poll refreshSpot every 10s (uncomment to start polling)
  //refreshSpotPoller = setInterval(function() { refreshSpot(web3, exchangeContract); }, 10000);

  optionToken.addEventListener('change', async() => {
    console.log('optionToken')
    exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(optionToken.value));
    marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", getMarketMakerAddress(optionToken.value));
    tokenContract = await getContract(web3, "./contracts/genericERC20.json", getUnderlyingAddress(optionToken.value))
    refreshSpot(web3, marketContract);
  })

  const calcPremium = async () => {
    console.log('calcPremium')
    if (optionStrike.value !== '' && optionAmount.value !== '') {
      const premium = await calcOptionPremium(web3, exchangeContract);
      premiumPrice.innerHTML = premium;
      await showOptions(web3, marketContract, exchangeContract, accounts[0]);
    }
  }

  optionType.addEventListener('change', calcPremium)
  optionExpiry.addEventListener('change', calcPremium)
  optionStrike.addEventListener('blur', calcPremium)
  optionAmount.addEventListener('blur', calcPremium)

  exchangeContract.events.newOptionBought({filter: {_purchaser: accounts[0]} },
    function(error, event){ console.log(event); })
    .on('data', function(returnValues){console.log(returnValues);
  }); // returnValues is the array of option information when it's purchased.

  purchaseButton.addEventListener('click', async() => {
    if (optionStrike.value !== '' && optionAmount.value !== '') {
      await calcAndBuyOption(web3, exchangeContract, tokenContract, accounts[0]);
      await showOptions(web3, marketContract, exchangeContract, accounts[0]);
    }
  })

  await showOptions(web3, marketContract, exchangeContract, accounts[0]);
  
  // OTHER
  await showMarketCapital(web3, marketContract, exchangeContract, accounts[0]);

  inputPoolInvest.addEventListener('focus', async() =>{
    await showPoolCost(web3, marketContract);
  })
  investInPool.addEventListener('click', async() => {
    await addCapital(web3,marketContract, tokenContract, accounts[0] );
  })
  withdrawFromPool.addEventListener('click', async() =>{
    await withdrawCapital(web3, marketContract, accounts[0]);
  })

  document.getElementById('invest-mp-unit').innerHTML = optionToken.value;

  await showVolatility(web3, exchangeContract);
};

async function calcOptionPremium(web3, exchange) {
  console.log('calcOptionPremium')

  const pricePricision = await exchange.methods.priceDecimals().call();
  const optType = convertOptionType(optionType.options[optionType.selectedIndex].text);
  const optExpiry = convertExpiry(optionExpiry.options[optionExpiry.selectedIndex].text);
  const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value));

  console.log(optExpiry);
  console.log(parseFloat(optStrike));
  console.log(optType);
  console.log(parseFloat(optAmount));

  const premium = await exchange.methods.queryOptionCost(optExpiry, optStrike, optAmount, optType, 0).call();
  console.log('premium', premium);
  return parseFloat(web3.utils.fromWei(web3.utils.toBN(premium))).toFixed(8);
}

async function calcAndBuyOption(web3, exchange, tokenContract, account) {
  console.log('calcAndBuyOption')

  const pricePricision = await exchange.methods.priceDecimals().call();
  const optType = convertOptionType(optionType.options[optionType.selectedIndex].text);
  const optExpiry = convertExpiry(optionExpiry.options[optionExpiry.selectedIndex].text);
  const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value));

  const premium = await exchange.methods.queryOptionCost(optExpiry, optStrike, optAmount, optType, 0).call();
  console.log('premium', premium);
  console.log(exchange._address);

  //const approveSuccess = await tokenContract.methods.increaseAllowance(exchange._address, premium).send({from:account, gas: 10**6});
  //console.log(approveSuccess);
  //if (approveSuccess){
    await exchange.methods.purchaseOption(optExpiry, optStrike, optType, optAmount, premium).send({from:account, gas: 10**6});
  //}
}

async function showOptions(web3, market, exchange, account){
  console.log('showOptions');

  const optionCount = await market.methods.getHoldersOptionCount(account).call();
  console.log(optionCount);

  // empty
  while( optionList.firstChild ){
    optionList.removeChild( optionList.firstChild );
  }

  for (let i = 0; i < optionCount; i++) {
    var option = await market.methods.getHoldersOption(i, account).call();
    var optionId = parseInt(option['id']);
    var optionPayoff = await exchange.methods.getOptionPayoffValue(optionId).call();

    // Please populate the section of 'Your current active contract' by adding more blocks
    // each of which contains the information specified below and an 'Exercise' button to link to the exerciseOption function

    let opt = document.createElement('span');
    opt.innerHTML = await formatOptionInfo(web3, exchange, option);

    let payoff = document.createElement('h5');
    payoff.innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionPayoff))).toFixed(4) + ' ' + optionToken.value;

    let amount = document.createElement('p');
    amount.innerHTML = formatOptionMaturity(web3, option);

    let exercise = document.createElement('a');
    exercise.appendChild(document.createTextNode("EXERCISE"));
    exercise.classList.add('btn')
    exercise.classList.add('btn-inverse')
    exercise.addEventListener('click', async() => {
      await exchange.methods.exerciseOption(optionId).send({from: account});
    });
    exchange.events.optionExercised({filter: {_purchaser: account} }, function(error, event) {  
      console.log(event);
    }).on('data', function(returnValues) {
      console.log(returnValues);
    }); // returnValues is the array of option information when it's purchased.
    
    let li = document.createElement('li');
    li.appendChild(opt)
    li.appendChild(payoff)
    li.appendChild(amount)
    li.appendChild(exercise)
    optionList.appendChild(li);
  }
}

async function showMarketCapital(web3, market, exchange, account){
   var grossCapital = await market.methods.calcCapital(false, false).call();
   var capitalRatios = await exchange.methods.calcUtilisation(0, 0, 0).call();
   var callExposure = await market.methods.callExposure().call();
   var putExposure = await market.methods.putExposure().call();

   var netCapital = await market.methods.calcCapital(true, false).call();
   var totalSupply = await market.methods.totalSupply().call();
   var netAvgCapital = await market.methods.calcCapital(true,true).call();

   let mpHolding = await market.methods.balanceOf(account).call();
   let mpHoldingValue = web3.utils.toBN(mpHolding).mul(web3.utils.toBN(netAvgCapital)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18)));

   console.log(grossCapital);
   console.log(['call', parseFloat(web3.utils.fromWei(web3.utils.toBN(callExposure))).toFixed(4)].join(' '));
   console.log(['put', parseFloat(web3.utils.fromWei(web3.utils.toBN(putExposure))).toFixed(4)].join(' '));
   console.log(netCapital);
   console.log(mpHolding);
   console.log(mpHoldingValue);

   document.getElementById('mp-gross-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital))).toFixed(2), optionToken.value, "<small>", Number(parseFloat(web3.utils.fromWei(web3.utils.toBN(capitalRatios[0])))).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}), "</small>"].join(' ');
   document.getElementById('call-exposure').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(callExposure))).toFixed(2), optionToken.value].join(' ');
   document.getElementById('put-exposure').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(putExposure))).toFixed(2), optionToken.value].join(' ');

   document.getElementById('available-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(netCapital))).toFixed(2), optionToken.value].join(' ');
   document.getElementById('mp-holding').innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHolding))).toFixed(2);
   document.getElementById('mp-holding-value').innerHTML = [parseFloat(web3.utils.fromWei(mpHoldingValue)).toFixed(2), optionToken.value].join(' ');

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
    const approveSuccess = await tokenContract.methods.increaseAllowance(market._address, investAmount).send({from:account, gas: 10**6});
  console.log(approveSuccess);
  if(approveSuccess){
    await market.methods.addCapital(investAmount).send({from: account, gas: 10**6});
  }
}

async function withdrawCapital(web3, market, account){
  var mpWithdraw = web3.utils.toWei(document.getElementById('withdraw-mp').value);
  console.log(mpWithdraw);
  const approveSuccess = await market.methods.increaseAllowance(market._address, mpWithdraw).send({from:account, gas: 10**6});
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
  showVol.innerHTML= volString;
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

  return [amount, optionToken.value, poType, 'at' , parseFloat(strike).toFixed(4)].join(' ');
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
  console.log('refreshSpot')

  const price = await exchange.methods.queryPrice().call();
  const pricePrecision = await exchange.methods.priceDecimals().call();

  const spotText = web3.utils.fromWei(web3.utils.toBN(Number(price[0])).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePrecision)))), 'ether');
  spotPrice.innerHTML =  parseFloat(spotText).toFixed(5);
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
