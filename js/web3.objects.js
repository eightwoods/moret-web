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

let optionPaymentInVol = false;
const optionPaymentCheckbox = document.getElementById('payment_token');

const optionStrike = document.getElementById('optionStrike');
const optionAmount = document.getElementById('optionAmount');

// spot & premium
const spotPrice = document.getElementById('tokenSpot');
const premiumPrice = document.getElementById('option-premium');
const collateralAmount = document.getElementById('option-collateral');
// const optionCost = document.getElementById('option-cost');

// capital
const capTitle = document.getElementById('capital-title');
const grossCap = document.getElementById('gross-capital');
const lpTokenHeld = document.getElementById('lp-holding');
// const lpTokenEquity = document.getElementById('lp-holding-gross');
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
// const showVol = [document.getElementById('1d-vol'), document.getElementById('7d-vol'), document.getElementById('30d-vol')];
const volatilityList = document.getElementById('volatility-list');
const volTenors = [1, 7, 30];


// Pool
const inputPoolInvest = document.getElementById('invest-lp-tokens');
const investInPool = document.getElementById('add-capital');
const inputPoolWithdraw = document.getElementById('withdraw-lp');
const withdrawFromPool = document.getElementById('withdraw-capital');

// Hao
let refreshSpotPoller
let refreshCapitalPoller
let moretContract
let brokerContract
let exchangeContract
let vaultContract
// let poolContract
// let marketContract
let fundingContract
let marketFactory
let poolFactory
let poolGovenorFactory
let poolTimelocker

// account
let currentAccount = null;
async function handleAccountsChanged(accounts){
  if(accounts.length===0){
    console.log('Please connect to MetaMask.');
  }
  else if(accounts[0]!==currentAccount){
    currentAccount =accounts[0];
    console.log('current account', currentAccount);
  }
}

async function formatPrice(inputNumber, obj){
  let x = parseFloat(inputNumber).toFixed(4) + '';
  x = x.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  obj.innerHTML = x1 + x2;
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

  const calcPremium = async () => {
    // console.log('calcPremium')
    try {
    if (optionStrike.value !== '' && optionAmount.value !== '') {
      const premium = await calcOptionPremium(web3, exchangeContract);
      //console.log(premium);
      await formatPrice(premium[0], premiumPrice);
      await formatPrice(premium[1], collateralAmount);
      // await formatPrice(premium[2], optionCost);
      purchaseButton.innerHTML='Purchase';
      purchaseButton.disabled=false;
      //await showOptions(web3, vaultContract, exchangeContract);
    }
    }
    catch (error) {
      console.log('error', error);
      purchaseButton.innerHTML='Liquidity Pool unable to underwrite this option';
      purchaseButton.disabled=true;
    }
  }

  const updateOptionToken = async () => {
    exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(optionToken));
    console.log('exchangeContract', exchangeContract._address);
    const marketMakerAddress = await exchangeContract.methods.marketMakerAddress().call();
    console.log('marketMakerAddress', marketMakerAddress);
    marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", marketMakerAddress);
    const vaultAddress = await exchangeContract.methods.vaultAddress().call();
    console.log('vaultAddress:', vaultAddress);
    vaultContract = await getContract(web3, "./contracts/OptionVault.json", vaultAddress);
    // const tokenAddress = await vaultContract.methods.underlying().call();
    // console.log('tokenAddress', tokenAddress);
    // tokenContract = await getContract(web3, "./contracts/ERC20.json", tokenAddress)
    const fundingAddress = await vaultContract.methods.funding().call();
    console.log('fundingAddress', fundingAddress);
    fundingContract = await getContract(web3, "./contracts/ERC20.json", fundingAddress)
    
    refreshSpot(web3, vaultContract);
    refreshCapital(web3, marketContract);
    await showOptions(web3, vaultContract, exchangeContract);
    await showVolatility(web3, vaultContract, exchangeContract, fundingContract);
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
  // Payment Currency
  optionPaymentCheckbox.addEventListener('click', async() => {
    optionPaymentInVol = optionPaymentCheckbox.checked;
    // console.log(optionPaymentInVol);
    if (optionPaymentInVol){
      var spotPrice = await vaultContract.methods.queryPrice().call();
      // console.log(spotPrice)
      optionStrike.value = await web3.utils.fromWei(web3.utils.toBN(spotPrice[0]));
      optionStrike.disabled= true;
    }
    else{
      optionStrike.disabled = false;
    }
    calcPremium();
  })

  moretContract = await getContract(web3, './contracts/Moret.json', getMoretAddress());
  console.log('moretContract', moretContract._address);
  exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress());
  console.log('exchangeContract', exchangeContract._address);

  const brokerAddress = await moretContract.methods.broker().call();
  brokerContract = await getContract(web3, './contracts/MoretBroker.json', brokerAddress);
  const vaultAddressInBroker = await brokerContract.methods.vault().call();
  const vaultAddress = await exchangeContract.methods.vault().call();
  if(vaultAddress!=vaultAddressInBroker){
    console.log('inconsistent vault address', vaultAddress, vaultAddressInBroker);
  }
  vaultContract = await getContract(web3, "./contracts/OptionVault.json", vaultAddress);

  const fundingAddress = await brokerContract.methods.funding().call();
  console.log('fundingAddress', fundingAddress);
  fundingContract = await getContract(web3, "./contracts/ERC20.json", fundingAddress)

  // factories
  marketFactory = await getContract(web3, "./contracts/MarketMakerFactory.json", getMarketFactory());
  poolFactory = await getContract(web3, "./contracts/PoolFactory.json", getPoolFactory());
  poolGovernorFactory = await getContract(web3, "./contracts/PoolGovenorFactory.json", getPoolGovernorFactory());

  // timelocker
  poolTimelocker = await getContract(web3, "./contracts/TimelockController.json", getTimelocker());
  
  // refreshSpot(web3, vaultContract);
  // refreshCapital(web3, marketContract);

  // Poll refreshSpot every 30s (uncomment to start polling)
  refreshSpotPoller = setInterval(function() { refreshSpot(web3, vaultContract); }, 2000);
  refreshCapitalPoller = setInterval(function() { refreshCapital(web3, marketContract); }, 10000);
  refreshOptionListPoller = setInterval(function() { showOptions(web3, vaultContract, exchangeContract); }, 60000);
  refreshPremiumPoller = setInterval(function() { calcPremium(); }, 2000);

  optionStrike.addEventListener('blur', calcPremium)
  optionAmount.addEventListener('blur', calcPremium)

  exchangeContract.events.NewOption({filter: {_purchaser: accounts[0]} },
    function(error, event){ console.log(event); })
    .on('data', function(returnValues){console.log(returnValues);
      showOptions(web3, vaultContract, exchangeContract);
  }).on('connected', str => console.log(str)); 

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

  await showVolatility(web3, vaultContract, exchangeContract, fundingContract);
  // console.log('test2');
};

// get list of tokens - to be used in conjunction with Chainlink API to get spot prices
async function getAllTokens(moret){
  const underlyingArray = await moret.methods.getAllUnderlyings().call();
  return underlyingArray;
}

// refresh list of pre-defined strikes
async function getStrikeList(web3, oracle){
  // const marketAddress = await pool.methods.marketMaker().call();
  // marketContract = await getContract(web3, "./contracts/MarketMaker.json", marketAddress);

  var price = await oracle.methods.queryPrice().call();
  var priceParsed = parseFloat(web3.utils.fromWei(price));
  let moneyness = [0.5, 0.4, 0.7, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.3, 1.4, 1.5];
  let strikes = Array(moneyness.length).fill("");
  for (let i = 0; i < strikes.length; i++) {
    let moneynessString = moneyness[i] == 1 ? 'ATM' : Number(moneyness[i]).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 });
    strikes[i] = (Math.round(priceParsed * moneyness[i] / 50) * 50).toString().concat(" | ", moneynessString); 
  }
  return strikes;
}

// refresh list of pre-defined tenors and implied volatilities 
async function getExpiryList(web3, oracle) {
  let expiryDays = [1, 7, 14, 21, 30, 60];
  let expiries = Array(expiryDays.length).fill(""); 

  for (let i = 0; i < expiries.length; i++) {
    var tenor = expiryDays[i] * 86400; // convert to seconds
    var vol = await oracle.methods.queryVol(tenor).call();  
    var volParsed = parseFloat(web3.utils.fromWei(vol));
    let expiryString = expiryDays[i].toString().concat(" ", expiryDays[i] == 1 ? 'Day' : 'Days');
    let volString = Number(volParsed).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 }).concat(" ", 'IV');
    expiries[i] = expiryString.concat(" | ", volString);
  }
  return expiries;
}

// get volatility token name
async function getVolTokenSymbol(web3, exchange, pool){
  const volTokenAddress = await exchange.methods.getVolatilityToken(pool.address, optExpiry).call();
  console.log(volTokenAddress);
  const volToken = await getContract(web3, './contracts/VolatilityToken.json', volTokenAddress);
  const volTokenSymbol = await volToken.methods.symbol().call();
  return volTokenSymbol;
}

// get option price, collateral and implied volatility (annualised values)
async function calcOptionPremium(web3, exchange, pool) {
  const optType = convertOptionType(optionType); // from Buy/Sell switch
  const optBuySell = convertBuySell(optionBuySell); // from Call/Put switch
  const optExpiry = convertExpiry(optionExpiry); // from either input or selection in expiry dropdown
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value)); // from Amount input

  const optStrike = web3.utils.toBN(web3.utils.toWei(convertStrike(optionStrike.value))); // from Strike dropdown list
  const pricePricision = await fundingContract.methods.decimals().call();

  const optionQuote = await exchange.methods.queryOption(pool.address, optExpiry, optStrike, optAmount, optType, optBuySell, false).call();
  console.log(optionQuote);
  var premium = web3.utils.toBN(optionQuote[0]).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(pricePricision))));
  var collateral = web3.utils.toBN(optionQuote[1]).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(pricePricision))));
  var volatility = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionQuote[2]), 'ether')).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 });

  return [volatility, parseFloat(web3.utils.fromWei(premium)).toFixed(0), parseFloat(web3.utils.fromWei(collateral)).toFixed(0)];
}

// get option price, collateral and implied volatility (annualised values) if paid in volatility tokens
async function calcOptionPremiumWithVolToken(web3, exchange, pool) {
  const optType = convertOptionType(optionType); // from Buy/Sell switch
  const optBuySell = convertBuySell(optionBuySell); // from Call/Put switch
  const optExpiry = convertExpiry(optionExpiry); // from either input or selection in expiry dropdown
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value)); // from Amount input

  const optionQuote = await exchange.methods.queryOption(pool.address, optExpiry, 0, optAmount, optType, optBuySell, true).call(); // force to be atm option
  console.log(optionQuote);
  var premium = web3.utils.fromWei(web3.utils.toBN(optionQuote[0]));
  var collateral = web3.utils.fromWei(web3.utils.toBN(optionQuote[1]));
  var volatility = web3.utils.fromWei(web3.utils.toBN(optionQuote[2]));
  var premiumInVol = parseFloat(premium) / parseFloat(volatility);
  
  return [parseFloat(volatility).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 }), premiumInVol.toFixed(0), parseFloat(collateral).toFixed(0)];
}

// function to purchase options in USDC
async function executeOption(web3, exchange, pool, funding) {
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('calcAndBuyOption', account);
  
  const optType = convertOptionType(optionType);
  const optExpiry = convertExpiry(optionExpiry);
  const optBuySell = convertBuySell(optionBuySell);
  const optStrike = web3.utils.toBN(web3.utils.toWei(convertStrike(optionStrike.value)));
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value));

  const optionQuote = await exchange.methods.queryOption(pool.address, optExpiry, optStrike, optAmount, optType, optBuySell, false).call();
  console.log(optionQuote);
  var premium = web3.utils.toBN(optionQuote[0]).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(pricePricision))));
  var collateral = web3.utils.toBN(optionQuote[1]).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(pricePricision))));
  // var volatility = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionQuote[2]), 'ether')).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 });

  var optionCost = premium.mul(web3.utils.toBN(Number(110))).div(web3.utils.toBN(Number(100))).add(collateral);
  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await funding.methods.approve(exchange._address, optionCost).estimateGas({ from: account, gasPrice: gasPriceAvg });
  var nonceNew = await web3.eth.getTransactionCount(account);
  await funding.methods.approve(exchange._address, payInValue).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });

  gasPriceAvg = await web3.eth.getGasPrice();
  gasEstimated = await exchange.methods.purchaseOption(optExpiry, optStrike, optAmount, optType, optBuySell, payInValue).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))))
  nonceNew = await web3.eth.getTransactionCount(account);
  await exchange.methods.tradeOption(pool.address, optExpiry, optStrike, optAmount, optType, optBuySell).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });
}

// function to purchase options in volatility token
async function executeOptionWithVolToken(web3, exchange, pool, funding) {
  var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' });
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('calcAndBuyOption', account);

  const optType = convertOptionType(optionType);
  const optExpiry = convertExpiry(optionExpiry);
  const optBuySell = convertBuySell(optionBuySell);
  // const optStrike = web3.utils.toBN(web3.utils.toWei(optionStrike.value));
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value));

  const volTokenAddress = await exchange.methods.getVolatilityToken(pool.address, optExpiry).call();
  console.log(volTokenAddress);
  const volToken = await getContract(web3, './contracts/VolatilityToken.json', volTokenAddress);
  
  const optionQuote = await exchange.methods.queryOption(pool.address, optExpiry, 0, optAmount, optType, optBuySell, true).call(); // force to be atm option
  console.log(optionQuote);
  var premium = web3.utils.fromWei(web3.utils.toBN(optionQuote[0]));
  var collateral = web3.utils.fromWei(web3.utils.toBN(optionQuote[1]));
  var volatility = web3.utils.fromWei(web3.utils.toBN(optionQuote[2]));
  var premiumInVol = parseFloat(premium) / parseFloat(volatility);
  
  var gasPriceAvg = await web3.eth.getGasPrice();

  if (premiumInVol > 0 && optBuySell == 0) // buy with vol
  {
    var premiumInVolToPay = web3.utils.toWei(premiumInVol * 1.05,'ether');
    var gasEstimated = await volToken.methods.approve(exchange._address, premiumInVolToPay).estimateGas({ from: account, gasPrice: gasPriceAvg });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);
    await volToken.methods.approve(exchange._address, payInValue).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });
  }
  
  if(collateral > 0) // collateral
  {
    var collateralToPay = web3.utils.toBN(optionQuote[1]).mul(web3.utils.toBN(Number(102))).div(web3.utils.toBN(Number(100))).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(pricePricision))));
    var gasEstimated = await funding.methods.approve(exchange._address, collateralToPay).estimateGas({ from: account, gasPrice: gasPriceAvg });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);
    await funding.methods.approve(exchange._address, collateralToPay).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });
  }

  gasEstimated = await exchange.methods.tradeOptionInVol(pool.address, optExpiry, optAmount, optType, optBuySell).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
  var nonceNew = await web3.eth.getTransactionCount(account);
  await exchange.methods.tradeOptionInVol(pool.address, optExpiry, optAmount, optType, optBuySell).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });
}

// function to show active options
async function showActiveOptions(web3, vault, pool){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);

  const optionArray = await vault.methods.getHolderOptions(pool.address, account).call();
  // console.log('option count',optionCount);

  // // empty
  while( optionList.firstChild ){
    optionList.removeChild( optionList.firstChild );
  }

  for (let i = 0; i < optionArray.length; i++) {
    var optionId = optionArray[i];
    var option = await vault.methods.getOption(optionId).call();
    // var optionPayoff = await exchange.methods.getOptionPayoffValue(optionId).call();

    // Please populate the section of 'Your current active contract' by adding more blocks
    // each of which contains the information specified below and an 'Exercise' button to link to the exerciseOption function

    let opt = document.createElement('span');
    opt.innerHTML = await formatOptionInfo(web3, option);

    // let payoff = document.createElement('h5');
    // payoff.innerHTML = parseFloat(web3.utils.fromWei(optionPayoff)).toFixed(4) + ' ' + fundingToken;

    // let amount = document.createElement('p');
    // amount.innerHTML = formatOptionMaturity(web3, option);

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

async function showVolatility(web3, vault, exchange, funding) {
  var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' });
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);

  const volCount = volTenors.length ; //await vault.methods.getHoldersOptionCount(account).call();
  // console.log('option count',optionCount);

  // empty
  while (volatilityList.firstChild) {
    volatilityList.removeChild(volatilityList.firstChild);
  }

  for (let i = 0; i < volCount; i++) {
    let volExpiry = web3.utils.toBN(86400 * volTenors[i]);
    var vol = await vault.methods.queryVol(volExpiry).call();
    var basePrice = await vault.methods.queryPrice().call();

    let volTokenAddress = await exchangeContract.methods.volTokenAddressList(volExpiry).call();
    // console.log(volTokenAddress);
    if (volTokenAddress == 0){
      continue;
    }
    let volToken = await getContract(web3, "./contracts/ERC20.json", volTokenAddress)
    let volTokenDecimals = await volToken.methods.decimals().call();
    // console.log(volTokenDecimals);

    let volDesc = document.createElement('span');
    let volValues = parseFloat(web3.utils.fromWei(vol)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });
    volDesc.innerHTML = String(volTenors[i]) + '-day volatility: ' + volValues; //await formatOptionInfo(web3, option);

    let volLevel = document.createElement('h5');
    volLevel.innerHTML = await formatVolatilityPrice(web3, vol, basePrice[0], fundingToken, optionToken);

    let amount = document.createElement('p');
    let volAmount = await volToken.methods.balanceOf(account).call();
    // console.log([volAmount, volTokenDecimals]);
    let volAmountString = await parseFloat(web3.utils.fromWei(volAmount)).toLocaleString(undefined, {
      minimumFractionDigits: 3}); //formatOptionMaturity(web3, option);
    amount.innerHTML = 'Holdings: ' + volAmountString;

    let tradeAmount = document.createElement('input');
    tradeAmount.type = 'number';
    tradeAmount.placeholder = '1';
    let tradeInputId = 'volTradeAmount' + String(volTenors[i]);
    tradeAmount.id = tradeInputId;

    // let tradeLabel = document.createElement('label');
    // tradeLabel.innerHTML = optionToken;

    let tradeAmountBox = document.createElement('div');
    tradeAmountBox.classList.add('col-md-5');
    tradeAmountBox.classList.add('text-right');
    tradeAmountBox.appendChild(tradeAmount);
    // tradeAmountBox.appendChild(tradeLabel);

    let buyButton = document.createElement('a');
    buyButton.appendChild(document.createTextNode("BUY"));
    buyButton.classList.add('btn')
    buyButton.classList.add('btn-inverse')
    buyButton.href = "#." 
    buyButton.addEventListener('click', async() => {
      await buyVolToken(web3, account, exchange, vault, volExpiry, tradeInputId, funding);
    });
    // exchange.events.optionExercised({filter: {_purchaser: account} }, function(error, event) {  
    //   console.log(event);
    // }).on('data', function(returnValues) {
    //   console.log(returnValues);
    // }); // returnValues is the array of option information when it's purchased.

    let sellButton = document.createElement('a');
    sellButton.appendChild(document.createTextNode("SELL"));
    sellButton.classList.add('btn')
    sellButton.href = "#." 
    sellButton.addEventListener('click', async () => {
      await sellVolToken(web3, account, exchange, vault, volExpiry, tradeInputId, volToken);
    });
    // exchange.events.optionExercised({ filter: { _purchaser: account } }, function (error, event) {
    //   console.log(event);
    // }).on('data', function (returnValues) {
    //   console.log(returnValues);
    // }); // returnValues is the array of option information when it's purchased.

    
    let tradeBox = document.createElement('ul')
    tradeBox.classList.add('row');
    // tradeBox.appendChild(tradeAmount);
    tradeBox.appendChild(buyButton);
    tradeBox.appendChild(sellButton);

    let li = document.createElement('li');
    li.appendChild(volDesc)
    li.appendChild(volLevel)
    li.appendChild(amount)
    li.appendChild(tradeAmountBox)
    li.appendChild(tradeBox)
    volatilityList.appendChild(li);
  }
}

// get option price, collateral and implied volatility (annualised values) if paid in volatility tokens
async function calcVolTokenQuote(web3, exchange, pool) {
  const optType = 0 ; //convertOptionType(optionType); // default to call
  const optBuySell = convertBuySell(optionBuySell); // from Call/Put switch
  const optExpiry = convertExpiry(optionExpiry); // from either input or selection in expiry dropdown
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value)); // from Amount input

  const optionQuote = await exchange.methods.queryOption(pool.address, optExpiry, 0, optAmount, optType, optBuySell, true).call(); // force to be atm option
  console.log(optionQuote);
  var premium = web3.utils.fromWei(web3.utils.toBN(optionQuote[0]));
  var collateral = web3.utils.fromWei(web3.utils.toBN(optionQuote[1]));
  var volatility = web3.utils.fromWei(web3.utils.toBN(optionQuote[2]));
  var premiumInVol = parseFloat(premium) / parseFloat(volatility);

  return [parseFloat(volatility).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 }), premiumInVol.toFixed(0), parseFloat(premium).toFixed(0)];
}

// function to buy or sell vol tokens
async function tradeVolToken(web3, exchange, pool){
  var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' });
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);

  const optBuySell = convertBuySell(optionBuySell); // from Call/Put switch
  const optExpiry = convertExpiry(optionExpiry); // from either input or selection in expiry dropdown
  const optAmount = web3.utils.toBN(web3.utils.toWei(optionAmount.value)); // from Amount input

  const volTokenAddress = await exchange.methods.getVolatilityToken(pool.address, optExpiry).call();
  console.log(volTokenAddress);
  const volToken = await getContract(web3, './contracts/VolatilityToken.json', volTokenAddress);

  const optionQuote = await exchange.methods.queryOption(pool.address, optExpiry, 0, optAmount, optType, optBuySell, true).call(); // force to be atm option
  console.log(optionQuote);
  var premium = web3.utils.fromWei(web3.utils.toBN(optionQuote[0]));
  var collateral = web3.utils.fromWei(web3.utils.toBN(optionQuote[1]));
  var volatility = web3.utils.fromWei(web3.utils.toBN(optionQuote[2]));
  var premiumInVol = parseFloat(premium) / parseFloat(volatility);

  var gasPriceAvg = await web3.eth.getGasPrice();
  if(optBuySell == 0) // buy vol token
  {
    var premiumToPay = web3.utils.toBN(optionQuote[0]).mul(web3.utils.toBN(Number(102))).div(web3.utils.toBN(Number(100))).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(pricePricision))));
    var gasEstimated = await funding.methods.approve(exchange._address, premiumToPay).estimateGas({ from: account, gasPrice: gasPriceAvg });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);
    await funding.methods.approve(exchange._address, premiumToPay).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });
  }
  else // sell vol token
  {
    var premiumInVolToPay = web3.utils.toWei(premiumInVol * 1.05, 'ether');
    var gasEstimated = await volToken.methods.approve(exchange._address, premiumInVolToPay).estimateGas({ from: account, gasPrice: gasPriceAvg });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);
    await volToken.methods.approve(exchange._address, payInValue).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });
  }

  var gasEstimated = await exchange.methods.tradeVolToken(pool.address, optExpiry, optAmount, optBuySell).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg * 1.2)
  await exchange.methods.tradeVolToken(pool.address, optExpiry, optAmount, optBuySell).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg });
}

// function to show the gross capitals of a pool and its 
async function getPoolCapital(web3, vault, pool){
  var grossCapital = await vault.methods.calcCapital(pool.address, false, false).call();
  var netCapital = await vault.methods.calcCapital(pool.address, true, false).call();
  var grossCapitalParsed = parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital)));
  var utilisation = (1 - parseFloat(web3.utils.fromWei(web3.utils.toBN(netCapital))) / grossCapitalParsed);
  return [grossCapitalParsed, utilisation]; 
}

// get list of liquidity pools for a given underlying (address)
async function updateAllPools(web3, broker, underlyingSelected) {
  const poolArray = await broker.methods.getAllUnderlyings(underlyingSelected).call();
  const topPool = await broker.methods.getTopPool(underlyingSelected).call();

  // populate the top pool first - to be updated


  // populate the tables and list
  for (let i = 0; i < poolArray.length; i++) {
    if(poolArray[i] != topPool){
      var pool = await getContract(web3, "./contracts/Pool.json", poolArray[i]);
      var marketAddress = await pool.methods.marketMaker().call();
      var market = await getContract(web3, "./contracts/MarketMaker.json", marketAddress);

      var description = await market.methods.description().call();
      var descInString = web3.utils.hexToAscii(description);

      var capital = await vault.methods.calcCapital(pool.address, false, false);
    }
  }
}

// function to deposit into a pool
async function depositPool(web3, exchange, poolAddress){
  var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' });
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  const pool = await getContract(web3, "./contracts/Pool.json", poolAddress);

  const investAmount = 100; // to be read from the text input

  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await funding.methods.approve(exchange._address, investAmount).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
  var nonceNew = await web3.eth.getTransactionCount(account);
  await funding.methods.approve(exchange._address, investAmount).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });

  var gasEstimated = await exchange.methods.addCapital(pool.address, investAmount).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg * 1.2)
  await exchange.methods.addCapital(pool.address, investAmount).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg });
}

// function to withdraw from a pool
async function withdrawPool(web3, exchange, poolAddress) {
  var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' });
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  const pool = await getContract(web3, "./contracts/Pool.json", poolAddress);

  const withdrawPoolAmount = 100; // to be read from the text input

  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await pool.methods.approve(exchange._address, withdrawPoolAmount).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
  var nonceNew = await web3.eth.getTransactionCount(account);
  await pool.methods.approve(exchange._address, withdrawPoolAmount).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg, nonce: nonceNew });

  var gasEstimated = await exchange.methods.withdrawCapital(pool.address, withdrawPoolAmount).estimateGas({ from: account, gasPrice: gasPriceAvg });
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg * 1.2)
  await exchange.methods.withdrawCapital(pool.address, withdrawPoolAmount).send({ from: account, gas: gasEstimated, gasPrice: gasPriceAvg });
}

// function to add pool
async function addNewPool(web3, token_address){
  var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' });
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);

  const hedging_bot = '0x'; // read from Address text input
  const marketMakerDescription = "aaa"; // read from description text input
  const poolName = "pool"; // read from pool description (a new text input)
  const poolSymbol = "ppp"; // read from a new text input

  const factoryCount = await marketFactory.methods.count().call();
  const salt = web3.utils.keccak256(factoryCount.toString());
  await marketFactory.methods.deploy(salt, hedging_bot, token_address, marketMakerDescription).send({ from: account });

  const marketAddress = await marketFactory.methods.computeAddress(salt, hedging_bot, token_address, marketMakerDescription).call();
  const market = await getContract(web3, "./contracts/MarketMaker.json", marketAddress);
  await poolFactory.deploy(salt, poolName, poolSymbol, marketAddress, poolTimelocker.address, broker.address).send({ from: account });

}


async function refreshCapital(web3, market){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  capTitle.innerHTML = [optionToken, 'Liquidity Pool'].join(' ');

  var grossCapital = await market.methods.calcCapital(false, false).call();
  var netCapital = await market.methods.calcCapital(true, false).call();
  var netAvgCapital = await market.methods.calcCapital(true,true).call();
  var grossAvgCapital = await market.methods.calcCapital(false,true).call();
  //  var totalSupply = await market.methods.totalSupply().call();
   
  let mpHolding = await market.methods.balanceOf(account).call();
  let mpHoldingEquity = web3.utils.toBN(mpHolding).mul(web3.utils.toBN(grossAvgCapital)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18)));
  let mpHoldingValue = web3.utils.toBN(mpHolding).mul(web3.utils.toBN(netAvgCapital)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18)));
  let capitalAvailable = parseFloat(web3.utils.fromWei(web3.utils.toBN(netCapital), 'ether')) / parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital), 'ether'))
 
  let progress = Number(capitalAvailable).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0});
  let cap_html = ["<div class=\"progress-bar\" role=\"progressbar\" style=\"width:", progress, ";\" aria-valuenow=\"50\" aria-valuemin=\"0\" aria-valuemax=\"150\"><span >", parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital))).toFixed(2), fundingToken, "<small>", progress," available</small></span> </div>"].join(' ');
  grossCap.innerHTML = cap_html;

  lpTokenHeld.innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHolding))).toFixed(2);
  // lpTokenEquity.innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHoldingEquity))).toFixed(2), fundingToken].join(' ');
  avgNetValue.innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(mpHoldingValue))).toFixed(2), fundingToken].join(' ');
  avgGrossValue.innerHTML = [parseFloat(web3.utils.fromWei(grossAvgCapital)).toFixed(2), fundingToken].join(' ');

}

async function showInvestPoolCost(web3, market){
  var mpCost = await market.methods.calcCapital(false ,true).call();
  var mpAmount = inputPoolInvest.value / parseFloat(web3.utils.fromWei(web3.utils.toBN(mpCost)));
  // web3.utils.fromWei(web3.utils.toWei(web3.utils.toBN(web3.utils.toWei(inputPoolInvest.value))).div(web3.utils.toBN(mpCost)));
  investLPCost.innerHTML =mpAmount.toFixed(4);
}

async function addCapital(web3, market, tokenContract){
  var accountsOnEnable = await ethereum.request({method:'eth_requestAccounts'});
  var account = web3.utils.toChecksumAddress(accountsOnEnable[0]);
  console.log('addCapital', account);

  var fundingTokenDecimals = await tokenContract.methods.decimals().call();
  var investAmount = web3.utils.toBN(web3.utils.toWei(inputPoolInvest.value,'ether')).div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(fundingTokenDecimals))));
  var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await tokenContract.methods.approve(market._address, investAmount).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)

  // var gasPriceSent = web3.utils.toBN(Number(gasPriceAvg)).mul(web3.utils.toBN(5)).div(web3.utils.toBN(10));
  await tokenContract.methods.approve(market._address, investAmount).send({from:account, gas: gasEstimated, gasPrice: gasPriceAvg});
  gasPriceAvg = await web3.eth.getGasPrice();
  gasEstimated = await market.methods.addCapital(investAmount).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)
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
 var gasPriceAvg = await web3.eth.getGasPrice();
  var gasEstimated = await market.methods.approve(market._address, mpWithdraw).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)

  await market.methods.approve(market._address, mpWithdraw).send({from:account, gas: gasEstimated, gasPrice: gasPriceAvg});
  gasPriceAvg = await web3.eth.getGasPrice();
  gasEstimated = await market.methods.withdrawCapital(mpWithdraw).estimateGas({from: account, gasPrice: gasPriceAvg});
  gasEstimated = parseInt(gasEstimated * 1.5)
  gasPriceAvg = parseInt(gasPriceAvg*1.2)

  await market.methods.withdrawCapital(mpWithdraw).send({from: account, gas: gasEstimated, gasPrice: gasPriceAvg});
  refreshCapital(web3, market);
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
  var amount = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionInfo['amount']))).toFixed(2);

  return [side, amount, optionToken, poType, 'at' , parseFloat(strike).toFixed(0)].join(' ');
}

function formatOptionMaturity(web3, optionInfo){
  var maturityTime = parseInt(optionInfo['effectiveTime']) + parseInt(optionInfo['tenor']);
  var maturity = new Date();
  maturity.setTime(maturityTime * 1000);

  return maturity.toUTCString();
}

async function formatVolatilityPrice(web3, vol, price, fundingToken, optionToken) {
  var volPercent = await(parseFloat(web3.utils.fromWei(web3.utils.toBN(vol)))).toLocaleString(undefined, { minimumFractionDigits: 4}) ;
  
  var volInBase = await web3.utils.fromWei(web3.utils.toBN(vol)) / (web3.utils.fromWei(web3.utils.toBN(price)));
  var volInBasePercent = await(parseFloat(volInBase).toLocaleString(undefined, { minimumFractionDigits: 6})) ; //parseFloat(web3.utils.fromWei(optionPayoff)).toFixed(4) + ' ' + fundingToken;
  // console.log(volPercent + ' ' + fundingToken + '/' + volInBasePercent + ' ' + optionToken);
  return volPercent + ' ' + fundingToken;// + '/' + volInBasePercent + ' ' + optionToken;
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

const refreshSpot = async (web3, vault)=>{
  const price = await vault.methods.queryPrice().call();
  
  const spotText = web3.utils.fromWei(web3.utils.toBN(price[0]), 'ether');
  let x = parseFloat(spotText).toFixed(2) + '';
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
  const expiryStringArray = expiryString.split(" ");
  return parseInt(expiryStringArray[0]) * 86400;
}

function convertStrike(strikeString) {
  const strikeStringArray = strikeString.split(" ");
  return parseFloat(strikeStringArray[0]);
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
      return "0xF8DbD3b5c17624e4769BD1aa35cD8ef46886a9F7";
      break;
    case "BTC":
      return "0x5D6eBa1Be9c762f0Bb0febDf90BF28A0C5771873";
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