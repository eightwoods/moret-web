// Form
let optionToken = 'ETH';
const optionTokenETH = document.getElementById('tokenSelected').getElementsByClassName("ETH")[0];
const optionTokenBTC = document.getElementById('tokenSelected').getElementsByClassName("WBTC")[0];

const fundingToken = 'USDC';

let optionExpiry = '1d';
const optionExpiryDay = document.getElementById('optionExpiry').getElementsByClassName("day")[0];
const optionExpiryWeek = document.getElementById('optionExpiry').getElementsByClassName("week")[0];
const optionExpiryMonth = document.getElementById('optionExpiry').getElementsByClassName("month")[0];

let optionType = 'Call';
const optionTypeCall = document.getElementById('optionType').getElementsByClassName("up")[0];
const optionTypePut = document.getElementById('optionType').getElementsByClassName("down")[0];

let optionBuySell = 'Buy';
const optionBuySellBuy = document.getElementById('optionBuySell').getElementsByClassName("buy")[0];
const optionBuySellSell = document.getElementById('optionBuySell').getElementsByClassName("sell")[0];

const optionStrike = document.getElementById('optionStrike');
const optionAmount = document.getElementById('optionAmount');

// spot & premium
const spotPrice = document.getElementById('tokenSpot');
const premiumPrice = document.getElementById('option-premium');

// capital
const grossCap = document.getElementById('gross-capital');
const lpTokenHeld = document.getElementById('lp-holding');
const lpTokenEquity = document.getElementById('lp-holding-gross');
const avgNetValue = document.getElementById('lp-average-net');
const avgGrossValue = document.getElementById('lp-average-gross');
const investLPCost = document.getElementById('invest-lp-cost');

// buttons
// const purchaseButton = document.getElementById('option-purchase');
const purchaseButton = document.querySelector('.buyOption');
const quoteButton = document.querySelector('.queryPremium');

// Options
const optionList = document.getElementById('option-list');

// Vol
const showVol = [document.getElementById('1d-vol'), document.getElementById('7d-vol'), document.getElementById('30d-vol')];
const volTenors = [1, 7, 30];

// Pool
const inputPoolInvest = document.getElementById('invest-lp-tokens');
const investInPool = document.getElementById('add-capital');
const inputPoolWithdraw = document.getElementById('withdraw-lp');
const withdrawFromPool = document.getElementById('withdraw-capital');

// Hao
let refreshSpotPoller
let refreshCapitalPoller
let exchangeContract
let marketContract
let tokenContract
let fundingContract

// account
let currentAccount = null;
function handleAccountsChanged(accounts){
  if(accounts.length===0){
    console.log('Please connect to MetaMask.');
  }
  else if(accounts[0]!==currentAccount){
    currentAccount =accounts[0];
    console.log('current account', currentAccount);
  }
}

ethereum.on('accountsChanged', handleAccountsChanged);

// Init
const initMarketMaker =  async () => {

  console.log('initialise');
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  ethereum.request({method: 'eth_accounts'}).then(handleAccountsChanged).catch((err)=>{
    console.error(err);
  })

  console.log('account', accounts[0]);

  const calcPremium = async () => {
    console.log('calcPremium')
    try {
    if (optionStrike.value !== '' && optionAmount.value !== '') {
      const premium = await calcOptionPremium(web3, exchangeContract);
      let x = parseFloat(premium).toFixed(4) + '';
      x = x.split('.');
      let x1 = x[0];
      let x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      premiumPrice.innerHTML = x1 + x2;
      purchaseButton.innerHTML='Purchase';
      purchaseButton.disabled=false;
      await showOptions(web3, vaultContract, exchangeContract);
    }
    }
    catch (error) {
      console.log('error', error);
      purchaseButton.innerHTML='Option Unavailable due to capital limit';
      purchaseButton.disabled=true;
    }
  }

  const updateOptionToken = async () => {
    console.log('optionToken')
    exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(optionToken));
    console.log('exchangeContract', exchangeContract._address);
    const marketMakerAddress = await exchangeContract.methods.marketMakerAddress().call();
    console.log('marketMakerAddress', marketMakerAddress);
    marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", marketMakerAddress);
    const vaultAddress = await exchangeContract.methods.vaultAddress().call();
    console.log('vaultAddress:', vaultAddress);
    vaultContract = await getContract(web3, "./contracts/OptionVault.json", vaultAddress);
    const tokenAddress = await vaultContract.methods.underlying().call();
    console.log('tokenAddress', tokenAddress);
    tokenContract = await getContract(web3, "./contracts/ERC20.json", tokenAddress)
    const fundingAddress = await vaultContract.methods.funding().call();
    console.log('fundingAddress', fundingAddress);
    fundingContract = await getContract(web3, "./contracts/ERC20.json", fundingAddress)
    refreshSpot(web3, exchangeContract);
    refreshCapital(web3, marketContract);
    await showOptions(web3, vaultContract, exchangeContract);
  }

  // Tokens
  optionTokenETH.addEventListener('click', async() => {
    if (!optionTokenETH.classList.contains('selected')) {
      optionTokenETH.classList.add('selected');
      optionTokenBTC.classList.remove('selected');
      optionToken = 'ETH';
      await updateOptionToken();
      await calcPremium();
    }
  })
  optionTokenBTC.addEventListener('click', async() => {
    if (!optionTokenBTC.classList.contains('selected')) {
      optionTokenBTC.classList.add('selected');
      optionTokenETH.classList.remove('selected');
      optionToken = 'BTC';
      await updateOptionToken();
      await calcPremium();
    }
  })
  // Type
  optionTypeCall.addEventListener('click', async() => {
    if (!optionTypeCall.classList.contains('selected')) {
      optionTypeCall.classList.add('selected');
      optionTypePut.classList.remove('selected');
      optionType = 'Call';
      await calcPremium();
    }
  })
  optionTypePut.addEventListener('click', async() => {
    if (!optionTypePut.classList.contains('selected')) {
      optionTypePut.classList.add('selected');
      optionTypeCall.classList.remove('selected');
      optionType = 'Put';
      await calcPremium();
    }
  })
  // BuySell
  optionBuySellBuy.addEventListener('click', async() => {
    if (!optionBuySellBuy.classList.contains('selected')) {
      optionBuySellBuy.classList.add('selected');
      optionBuySellSell.classList.remove('selected');
      optionBuySell = 'Buy';
      await calcPremium();
    }
  })
  optionBuySellSell.addEventListener('click', async() => {
    if (!optionBuySellSell.classList.contains('selected')) {
      optionBuySellSell.classList.add('selected');
      optionBuySellBuy.classList.remove('selected');
      optionBuySell = 'Sell';
      await calcPremium();
    }
  })
  // Expiry
  optionExpiryDay.addEventListener('click', async() => {
    if (!optionExpiryDay.classList.contains('selected')) {
      optionExpiryDay.classList.add('selected');
      optionExpiryWeek.classList.remove('selected');
      optionExpiryMonth.classList.remove('selected');
      optionExpiry = '1d';
      await calcPremium();
    }
  })
  optionExpiryWeek.addEventListener('click', async() => {
    if (!optionExpiryWeek.classList.contains('selected')) {
      optionExpiryDay.classList.remove('selected');
      optionExpiryWeek.classList.add('selected');
      optionExpiryMonth.classList.remove('selected');
      optionExpiry = '7d';
      await calcPremium();
    }
  })
  optionExpiryMonth.addEventListener('click', async() => {
    if (!optionExpiryMonth.classList.contains('selected')) {
      optionExpiryDay.classList.remove('selected');
      optionExpiryWeek.classList.remove('selected');
      optionExpiryMonth.classList.add('selected');
      optionExpiry = '30d';
      await calcPremium();
    }
  })

  exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(optionToken));
  console.log('exchangeContract', exchangeContract._address);
  const marketMakerAddress = await exchangeContract.methods.marketMakerAddress().call();
  console.log('marketMakerAddress', marketMakerAddress);
  marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", marketMakerAddress);
  const vaultAddress = await exchangeContract.methods.vaultAddress().call();
  console.log('vaultAddress:', vaultAddress);
  vaultContract = await getContract(web3, "./contracts/OptionVault.json", vaultAddress);
  const tokenAddress = await vaultContract.methods.underlying().call();
  console.log('tokenAddress', tokenAddress);
  tokenContract = await getContract(web3, "./contracts/ERC20.json", tokenAddress)
  const fundingAddress = await vaultContract.methods.funding().call();
  console.log('fundingAddress', fundingAddress);
  fundingContract = await getContract(web3, "./contracts/ERC20.json", fundingAddress)

  refreshSpot(web3, exchangeContract);
  refreshCapital(web3, marketContract);

  // Poll refreshSpot every 30s (uncomment to start polling)
  refreshSpotPoller = setInterval(function() { refreshSpot(web3, exchangeContract); }, 30000);
  refreshCapitalPoller = setInterval(function() { refreshCapital(web3, marketContract); }, 60000);

  optionStrike.addEventListener('blur', calcPremium)
  optionAmount.addEventListener('blur', calcPremium)

  exchangeContract.events.newOptionBought({filter: {_purchaser: accounts[0]} },
    function(error, event){ console.log(event); })
    .on('data', function(returnValues){console.log(returnValues);
  }); // returnValues is the array of option information when it's purchased.

  purchaseButton.addEventListener('click', async() => {
    if (optionStrike.value !== '' && optionAmount.value !== '') {
      
      await calcAndBuyOption(web3, exchangeContract, fundingContract);
      await showOptions(web3, vaultContract, exchangeContract);
    }
  })

  await showOptions(web3, vaultContract, exchangeContract);
  
  // OTHER
  // await showMarketCapital(web3, marketContract, exchangeContract, accounts[0]);

  inputPoolInvest.addEventListener('focus', async() =>{
    await showInvestPoolCost(web3, marketContract);
  })
  investInPool.addEventListener('click', async() => {
    await addCapital(web3,marketContract, fundingContract );
  })
  withdrawFromPool.addEventListener('click', async() =>{
    await withdrawCapital(web3, marketContract);
  })

  // document.getElementById('invest-mp-unit').innerHTML = optionToken;

  await showVolatility(web3, exchangeContract);
};

async function calcOptionPremium(web3, exchange) {
  console.log('calcOptionPremium')

  const optType = convertOptionType(optionType);
  const optExpiry = convertExpiry(optionExpiry);
  const optBuySell = convertBuySell(optionBuySell);
  // const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value));
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value));

  console.log(optExpiry);
  console.log(parseFloat(optStrike));
  console.log(optionExpiry);
  console.log(optType);
  console.log(optBuySell);
  console.log(parseFloat(optAmount));

  const optCost = await exchange.methods.calcOptionCost(optExpiry, optStrike, optAmount, optType, optBuySell).call();
  console.log('premium & cost', optCost);

  const pricePricision = await fundingContract.methods.decimals().call();
  const cost = web3.utils.toBN(optCost[1]).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  return parseFloat(web3.utils.fromWei(cost)).toFixed(4);
}

async function calcAndBuyOption(web3, exchange, tokenContract) {
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('calcAndBuyOption', account);
  
  // const pricePricision = await exchange.methods.priceDecimals().call();
  const optType = convertOptionType(optionType);
  const optExpiry = convertExpiry(optionExpiry);
  const optBuySell = convertBuySell(optionBuySell);
  // const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value));
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value));

  const optCost = await exchange.methods.calcOptionCost(optExpiry, optStrike, optAmount, optType, optBuySell).call();
  console.log('premium & cost', optCost);
  // console.log(exchange._address);
  var payInValue = web3.utils.toBN(optCost[1]).mul(web3.utils.toBN(Number(105))).div(web3.utils.toBN(Number(100)));

  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await tokenContract.methods.approve(exchange._address, payInValue).estimateGas({from: account, gasPrice: gasPriceAvg});
  console.log('gas estimated for approval', gasEstimated, 'price', gasPriceAvg);
  var nonceNew = await web3.eth.getTransactionCount(account);
  await tokenContract.methods.approve(exchange._address, payInValue).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew});
  console.log('approval done');

  gasPriceAvg = await web3.eth.getGasPrice();
  gasEstimated = await exchange.methods.purchaseOption(optExpiry, optStrike, optAmount, optType, optBuySell, payInValue).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))))
  console.log('gas estimated for purchase', gasEstimated, 'price', gasPriceAvg);
  nonceNew = await web3.eth.getTransactionCount(account);
  await exchange.methods.purchaseOption(optExpiry, optStrike, optAmount, optType, optBuySell, payInValue).send({from:account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew});
}

async function showOptions(web3, vault, exchange){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('showOptions', account);

  const optionCount = await vault.methods.getHoldersOptionCount(account).call();
  console.log('option count',optionCount);

  // empty
  while( optionList.firstChild ){
    optionList.removeChild( optionList.firstChild );
  }

  for (let i = 0; i < optionCount; i++) {
    var option = await vault.methods.getHoldersOption(i, account).call();
    var optionId = parseInt(option['id']);
    console.log(optionId);
    var optionPayoff = await exchange.methods.getOptionPayoffValue(optionId).call();

    // Please populate the section of 'Your current active contract' by adding more blocks
    // each of which contains the information specified below and an 'Exercise' button to link to the exerciseOption function

    let opt = document.createElement('span');
    opt.innerHTML = await formatOptionInfo(web3, option);

    let payoff = document.createElement('h5');
    payoff.innerHTML = parseFloat(web3.utils.fromWei(optionPayoff)).toFixed(4) + ' ' + fundingToken;

    let amount = document.createElement('p');
    amount.innerHTML = formatOptionMaturity(web3, option);

    // let exercise = document.createElement('a');
    // exercise.appendChild(document.createTextNode("EXERCISE"));
    // exercise.classList.add('btn')
    // exercise.classList.add('btn-inverse')
    // exercise.addEventListener('click', async() => {
    //   await exchange.methods.exerciseOption(optionId).send({from: account});
    // });
    // exchange.events.optionExercised({filter: {_purchaser: account} }, function(error, event) {  
    //   console.log(event);
    // }).on('data', function(returnValues) {
    //   console.log(returnValues);
    // }); // returnValues is the array of option information when it's purchased.
    
    let li = document.createElement('li');
    li.appendChild(opt)
    li.appendChild(payoff)
    li.appendChild(amount)
    // li.appendChild(exercise)
    optionList.appendChild(li);
  }
}

async function refreshCapital(web3, market){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('refreshCapital', account);

  var grossCapital = await market.methods.calcCapital(false, false).call();
  var netCapital = await market.methods.calcCapital(true, false).call();
  var netAvgCapital = await market.methods.calcCapital(true,true).call();
  var grossAvgCapital = await market.methods.calcCapital(false,true).call();
  //  var totalSupply = await market.methods.totalSupply().call();
   
  let mpHolding = await market.methods.balanceOf(account).call();
  let mpHoldingEquity = web3.utils.toBN(mpHolding).mul(web3.utils.toBN(grossAvgCapital)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18)));
  let mpHoldingValue = web3.utils.toBN(mpHolding).mul(web3.utils.toBN(netAvgCapital)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18)));
  let capitalAvailable = parseFloat(web3.utils.fromWei(web3.utils.toBN(netCapital), 'ether')) / parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital), 'ether'))
 
  console.log('capital', grossCapital, capitalAvailable, netAvgCapital);

  let progress = Number(capitalAvailable).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0});
  // console.log(progress);
  let cap_html = ["<div class=\"progress-bar\" role=\"progressbar\" style=\"width:", progress, ";\" aria-valuenow=\"50\" aria-valuemin=\"0\" aria-valuemax=\"150\"><span >", parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital))).toFixed(2), fundingToken, "<small>", progress," available</small></span> </div>"].join(' ');
  // console.log(cap_html);
  grossCap.innerHTML = cap_html;

  lpTokenHeld.innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHolding))).toFixed(2);
  lpTokenEquity.innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHoldingEquity))).toFixed(2), fundingToken].join(' ');
  avgNetValue.innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHoldingValue))).toFixed(2), fundingToken].join(' ');
  avgGrossValue.innerHTML = [parseFloat(web3.utils.fromWei(grossAvgCapital)).toFixed(2), fundingToken].join(' ');

}

async function showInvestPoolCost(web3, market){
  console.log('showInvestPoolCost');
  var mpCost = await market.methods.calcCapital(false ,true).call();
  console.log(web3.utils.fromWei(web3.utils.toBN(mpCost)));
  // console.log(inputPoolInvest.value);
  var mpAmount = inputPoolInvest.value / parseFloat(web3.utils.fromWei(web3.utils.toBN(mpCost)));
  // web3.utils.fromWei(web3.utils.toWei(web3.utils.toBN(web3.utils.toWei(inputPoolInvest.value))).div(web3.utils.toBN(mpCost)));
  console.log(mpAmount);
  investLPCost.innerHTML =mpAmount.toFixed(4);
}

async function addCapital(web3, market, tokenContract){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('addCapital', account);

  var fundingTokenDecimals = await tokenContract.methods.decimals().call();
  var investAmount = web3.utils.toBN(inputPoolInvest.value).mul(web3.utils.toBN(10).pow(web3.utils.toBN(Number(fundingTokenDecimals))));
  console.log(investAmount);
  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await tokenContract.methods.approve(market._address, investAmount).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)
  console.log('gas estimated', gasEstimated, 'price', gasPriceAvg);
  // var gasPriceSent = web3.utils.toBN(Number(gasPriceAvg)).mul(web3.utils.toBN(5)).div(web3.utils.toBN(10));
  await tokenContract.methods.approve(market._address, investAmount).send({from:account, gas: gasEstimated, gasPrice: gasPriceAvg});
  gasPriceAvg = await web3.eth.getGasPrice();
  gasEstimated = await market.methods.addCapital(investAmount).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)
  console.log('gas estimated', gasEstimated, 'price', gasPriceAvg);
  await market.methods.addCapital(investAmount).send({from: account, gas: gasEstimated, gasPrice: gasPriceAvg});
  refreshCapital(web3, market);
}

async function withdrawCapital(web3, market){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('withdrawCapital', account, Number(lpTokenHeld.innerHTML), Number(inputPoolWithdraw.value));
  
  if(Number(lpTokenHeld.innerHTML)>= Number(inputPoolWithdraw.value))
  {
  var mpWithdraw = web3.utils.toWei(inputPoolWithdraw.value);
  console.log(mpWithdraw);
  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await market.methods.approve(market._address, mpWithdraw).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)
  console.log('gas estimated', gasEstimated, 'price', gasPriceAvg);
  await market.methods.approve(market._address, mpWithdraw).send({from:account, gas: gasEstimated, gasPrice: gasPriceAvg});
  gasPriceAvg = await web3.eth.getGasPrice();
  gasEstimated = await market.methods.withdrawCapital(mpWithdraw).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)
  console.log('gas estimated', gasEstimated, 'price', gasPriceAvg);
  await market.methods.withdrawCapital(mpWithdraw).send({from: account, gas: gasEstimated, gasPrice: gasPriceAvg});
  refreshCapital(web3, market);
}
}

async function showVolatility(web3, exchange){
  console.log('showVolatility')
  for (let i = 0;i < volTenors.length; i++){
    var vol = await exchange.methods.queryVol(web3.utils.toBN(86400 * volTenors[i])).call();
    // console.log(volTenors[i], vol);
    var volString = await (parseFloat(web3.utils.fromWei(web3.utils.toBN(vol)))).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
    // console.log(volString);
    showVol[i].innerHTML= volString;
  }
}

async function formatOptionInfo(web3, optionInfo){
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

  let side;
  switch(parseInt(optionInfo['side'])){
    case 0:
      side = "Buy";
      break;
    case 1:
      side = "Sell";
      break;
    default:
      side = "Undefined";
  }

  // var precision = await exchange.methods.priceDecimals().call();
  var strike = web3.utils.fromWei(web3.utils.toBN(optionInfo['strike']), 'ether');
  var amount = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionInfo['amount']))).toFixed(4);

  return [side, amount, optionToken, poType, 'at' , parseFloat(strike).toFixed(4)].join(' ');
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
  // const pricePrecision = await exchange.methods.priceDecimals().call();
  // const spotText = web3.utils.fromWei(web3.utils.toBN(Number(price[0])).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePrecision)))), 'ether');

  const spotText = web3.utils.fromWei(web3.utils.toBN(price[0]), 'ether');
  let x = parseFloat(spotText).toFixed(4) + '';
  x = x.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  spotPrice.innerHTML = x1 + x2;
}

const refreshVolatility = async (web3, exchange)=>{
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
    case "1d":
      return 86400;
      break;
    case "7d":
      return 7 * 86400;
      break;
    case "30d":
      return 30 * 86400;
      break;
    default:
      return 0;
  }
}

function convertBuySell(buySellString){
  switch(buySellString){
    case "Buy":
      return 0;
      break;
    case "Sell":
      return 1;
      break;
    default:
      return -1;
  }
}

const getExchangeAddress = (tokenName) => {
  switch(tokenName) {
    case "ETH":
      return "0x31BA7C171065022425156AB5Ce48d42930C5Af8a";
      break;
    case "BTC":
      return "0x3A4e815F264909f8Bd4a45fb58Ee3C38386A0803";
      break;
    default:
      return -1;
  }
}

function formatNumber(number, decimal){
  const numberText = web3.utils.fromWei(web3.utils.toBN(number), 'ether');
  let x = parseFloat(numberText).toFixed(decimal) + '';
  x = x.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2
}