const enableWalletButton = document.querySelector('.enableWallet');
const showSpot = document.getElementById('tokenSpot');
const selectedToken = document.getElementById('tokenSelected');

const optionQueryPremiumButton = document.querySelector('.queryPremium');
const showPremiumButton = document.querySelector('.queryPremium');
const showPremium = document.getElementById('option-premium');
const buyOptionButton = document.querySelector('.buyOption');
const showVol = document.getElementById('1d-vol');

const inputPoolToken = document.getElementById('invest-mp');

const inputType = document.getElementById('optionType');
const inputExpiry = document.getElementById('optionExpiry');
const inputStrike = document.getElementById('optionStrike');
const inputAmount = document.getElementById('optionAmount');

// Please change the following so initMarketMaker is called whenever 1)
inputStrike.addEventListener('focus', async() =>{

  const initMarketMaker =  async () =>{
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    const exchangeContract = await getContract(web3, "./contracts/Exchange.json", getExchangeAddress(selectedToken.value));
    const marketContract = await getContract(web3, "./contracts/MoretMarketMaker.json", getMarketMakerAddress(selectedToken.value));
    const tokenContract = await getContract(web3, "./contracts/genericERC20.json", getUnderlyingAddress(selectedToken.value));

    await refreshSpot(web3, marketContract);

    showPremiumButton.addEventListener('click', async () =>{
      const premium = await calcOptionPremium(web3, exchangeContract);
      showPremium.innerHTML = premium;
      await showOptions(web3, exchangeContract, accounts[0]);
    } )


    exchangeContract.events.newOptionBought({filter: {_purchaser: accounts[0]} },
       function(error, event){ console.log(event); })
       .on('data', function(returnValues){console.log(returnValues);}); // returnValues is the array of option information when it's purchased.


    buyOptionButton.addEventListener('click', async() => {
      await calcAndBuyOption(web3, exchangeContract, tokenContract, accounts[0]);
      await showOptions(web3, exchangeContract, accounts[0]);
    })


    await showMarketCapital(web3, marketContract);

    inputPoolToken.addEventListener('focus', async() =>{
      await showPoolCost(web3, marketContract);
    })


    console.log('vol');
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
  const premium = await exchange.methods.queryOptionCost(optionExpiry, optionStrike, optionType, optionAmount).call();
  // console.log(premium);
  return parseFloat(web3.utils.fromWei(web3.utils.toBN(premium))).toFixed(8);
}

async function calcAndBuyOption(web3, exchange, tokenContract, account) {
  const pricePricision = await exchange.methods.priceDecimals().call();

  var optionType = convertOptionType(inputType.options[inputType.selectedIndex].text);
  var optionExpiry = convertExpiry(inputExpiry.options[inputExpiry.selectedIndex].text);
  var optionStrike = web3.utils.toBN(web3.utils.toWei(inputStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  var optionAmount = web3.utils.toBN(web3.utils.toWei(inputAmount.value));

  const premium = await exchange.methods.queryOptionCost(optionExpiry, optionStrike, optionType, optionAmount).call();
  console.log(premium);
  console.log(getExchangeAddress(selectedToken.value));
  const approveSuccess = await tokenContract.methods.approve(getMarketMakerAddress(selectedToken.value), premium).send({from:account, gas: 10**6});
  console.log(approveSuccess);
  await exchange.methods.purchaseOption(optionExpiry, optionStrike, optionType, optionAmount, premium).send();

}

async function showOptions(web3, market, exchange, account){
  const optionCount = await market.methods.getHoldersOptionCount(account).call();
  console.log(optionCount);
  for (let i = 0; i < optionCount; i++) {
    var option = await market.methods.getHoldersOption(i, account).call();
    var optionId = parseInt(option['id']);
    // var optionPayoff = await market.methods.getOptionPayoff(optionId).call();
    // Please populate the section of 'Your current active contract' by adding more blocks
    // each of which contains the information specified below and an 'Exercise' button to link to the exerciseOption function
    document.getElementById('option-1').innerHTML = await formatOptionInfo(web3, market, option);
    document.getElementById('option-payoff-1').innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionPayoff))).toFixed(4) + ' ' + selectedToken.value;
    document.getElementById('option-amount-1').innerHTML = formatOptionMaturity(web3, option);

    exchange.events.optionExercised({filter: {_purchaser: accounts[0]} },
       function(error, event){ console.log(event); })
       .on('data', function(returnValues){console.log(returnValues);}); // returnValues is the array of option information when it's purchased.

    // document.getElementById('option-exercise-1').addEventListener('click', async=>{
    //     await exchange.methods.exerciseOption(optionId).send({from: account});
    // })
  }
}

async function showMarketCapital(web3, market){
   var grossCapital = await market.methods.calcCapital(false, false).call();
   console.log(grossCapital);

   var netCapital = await market.methods.calcCapital(true, false).call();
   // var capitalRatios = await market.methods.calcUtilityRatios(0, 0).call();
   // var fundingCapital = market.methods.getFundingCapital().call();
   // var tokenCapital = market.methods.getUnderlyingCapital().call();
   // var fundingSymbol = market.methods.getFundingTokenSymbol().call();
   // console.log(netCapital);

   var totalSupply = await market.methods.totalSupply().call();
   var netAvgCapital = await market.methods.calcCapital(true,true).call();
   console.log(netAvgCapital);
   console.log(totalSupply);

   // document.getElementById('mp-gross-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(grossCapital))).toFixed(4), "<small>", Number(parseFloat(web3.utils.toBN(capitalRatios[0]).div(web3.utils.toBN(capitalRatios[2])))/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}), "</small>"].join(' ');
   document.getElementById('available-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(netCapital))).toFixed(4), selectedToken.value].join(' ');
   // document.getElementById('capital-underlying').innerHTML = [web3.utils.fromWei(web3.utils.toBN(tokenCapital))).toFixed(4), selectedToken.value].join(' ');
   // document.getElementById('capital-underlying').innerHTML = [web3.utils.fromWei(web3.utils.toBN(fundingCapital))).toFixed(4), fundingSymbol].join(' ');

   document.getElementById('mp-supply').innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(totalSupply))).toFixed(2);
   document.getElementById('average-capital').innerHTML = [parseFloat(web3.utils.fromWei(web3.utils.toBN(netAvgCapital))).toFixed(4), selectedToken.value].join(' ');

}

async function showPoolCost(web3, market){
  console.log('mpCost');
  var mpCost = await market.methods.quoteCapitalCost(web3.utils.toBN(web3.utils.toWei(inputPoolToken.value))).call();

  document.getElementById('invest-mp-cost').innerHTML([parseFloat(web3.utils.fromWei(web3.utils.toBN(mpCost))).toFixed(4), selectedToken.value].join(' '));
}

async function showVolatility(web3, exchange){
  var vol = await exchange.methods.queryVol(web3.utils.toBN(86400)).call();
  console.log(vol);
  var volDecimals = await exchange.methods.priceDecimals().call();
  console.log(volDecimals);
  document.getElementById('1d-vol').innerHTML((parseFloat(web3.utils.fromWei(web3.utils.toBN(vol).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(volDecimals))))))/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}));
}


async function formatOptionInfo(web3, market, optionInfo){
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

  var precision = await market.methods.priceDecimals().call();
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

const refreshSpot = async (web3, market)=>{
  const price = await market.methods.queryPrice().call();
  const pricePrecision = await market.methods.priceDecimals().call();

  const spotText = web3.utils.fromWei(web3.utils.toBN(Number(price)).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePrecision)))), 'ether');
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

const getMarketMakerAddress = (tokenName) => {
  switch(tokenName) {
    case "MATIC":
      return "0xe0c522e2C07a1D42bC71f312C71548Cee10D92fb";
      break;
    case "ETH":
      return "0xF7Bc8995776bF579c84D7207b13D30eDC536838E";
      break;
    case "BNB":
      return "0x";
      break;
    default:
      return -1;
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
    case "BNB":
      return "0x";
      break;
    default:
      return -1;
  }
}

const getUnderlyingAddress = (tokenName) => {
  switch(tokenName) {
    case "MATIC":
      return "0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62";
      break;
    case "ETH":
      return "0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62";
      break;
    case "BNB":
      return "0x";
      break;
    default:
      return -1;
  }
}
