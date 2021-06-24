const enableWalletButton = document.querySelector('.enableWallet');
const showSpot = document.getElementById('tokenSpot');
const selectedToken = document.getElementById('tokenSelected');

const optionQueryPremiumButton = document.querySelector('.queryPremium');
const showPremiumButton = document.querySelector('.queryPremium');
const showPremium = document.getElementById('option-premium');
const buyOptionButton = document.querySelector('.buyOption');


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
    const contract = await getContract(web3, "./contracts/MarketMaker.json", getMarketMakerAddress(selectedToken.value));
    // const underlyingAddress = await contract.methods.getUnderlyingAddress().call();
    const tokenContract = await getContract(web3, "./contracts/genericERC20.json", getUnderlyingAddress(selectedToken.value));

    await refreshSpot(web3, contract);

    showPremiumButton.addEventListener('click', async () =>{
      const premium = await calcOptionPremium(web3, contract);
      showPremium.innerHTML = premium;
      await showOptions(web3, contract, accounts[0]);
    } )

    buyOptionButton.addEventListener('click', async() => {
      await calcAndBuyOption(web3, contract, tokenContract, accounts[0]);
      await showOptions(web3, contract, accounts[0]);
    })

  }
  await initMarketMaker();
})


async function calcOptionPremium(web3, contract) {
  const pricePricision = await contract.methods.priceDecimals().call();

  var optionType = convertOptionType(inputType.options[inputType.selectedIndex].text);
  var optionExpiry = convertExpiry(inputExpiry.options[inputExpiry.selectedIndex].text);
  var optionStrike = web3.utils.toBN(web3.utils.toWei(inputStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  var optionAmount = web3.utils.toBN(web3.utils.toWei(inputAmount.value));
  //
  // console.log(optionExpiry);
  // console.log(parseFloat(optionStrike));
  // console.log(optionType);
  // console.log(parseFloat(optionAmount));
  const premium = await contract.methods.queryPremium(optionExpiry, optionStrike, optionType, optionAmount).call();
  // console.log(premium);
  return parseFloat(web3.utils.fromWei(web3.utils.toBN(premium))).toFixed(8);
}

async function calcAndBuyOption(web3, contract, tokenContract, account) {
  const pricePricision = await contract.methods.priceDecimals().call();

  var optionType = convertOptionType(inputType.options[inputType.selectedIndex].text);
  var optionExpiry = convertExpiry(inputExpiry.options[inputExpiry.selectedIndex].text);
  var optionStrike = web3.utils.toBN(web3.utils.toWei(inputStrike.value)).div(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePricision))));
  var optionAmount = web3.utils.toBN(web3.utils.toWei(inputAmount.value));

  const premium = await contract.methods.queryPremium(optionExpiry, optionStrike, optionType, optionAmount).call();
  console.log(premium);
  console.log(getMarketMakerAddress(selectedToken.value));
  // const approveSuccess = await tokenContract.methods.approve(getMarketMakerAddress(selectedToken.value), premium).send({from:account, gas: 10**6});
  // console.log(approveSuccess);
  await contract.methods.addAndbuyOptionInNativeToken(optionExpiry, optionStrike, optionType, optionAmount).send({from: account, value: premium});
}

async function showOptions(web3, contract, account){
  const optionCount = await contract.methods.getActiveOwnOptionCount().call({from: account});
  console.log(optionCount);
  for (let i = 0; i < optionCount; i++) {
    var option = await contract.methods.getActiveOwnOption(i).call({from: account});
    var optionId = parseInt(option['id']);
    var optionPayoff = await contract.methods.getOptionPayoffValue(optionId).call();
    // Please populate the section of 'Your current active contract' by adding more blocks
    // each of which contains the information specified below and an 'Exercise' button to link to the exerciseOption function
    document.getElementById('option-1').innerHTML = await formatOptionInfo(web3, contract, option);
    document.getElementById('option-payoff-1').innerHTML = parseFloat(web3.utils.fromWei(web3.utils.toBN(optionPayoff))).toFixed(4) + ' ' + selectedToken.value;
    document.getElementById('option-amount-1').innerHTML = formatOptionMaturity(web3, option);
    document.getElementById('option-exercise-1').addEventListener('click', async=>{

    })
  }
}


async function formatOptionInfo(web3, contract, optionInfo){
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

  var precision = await contract.methods.priceDecimals().call();
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

const refreshSpot = async (web3, contract)=>{
  const prices = await contract.methods.queryPrice().call();
  const pricePrecision = await contract.methods.priceDecimals().call();

  const spotText = web3.utils.fromWei(web3.utils.toBN(Number(prices[0])).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18-Number(pricePrecision)))), 'ether');
  showSpot.innerHTML =  parseFloat(spotText).toFixed(5);
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
      return "0x8d16DA0C4C2E7916A0209DFD829EF6f9F2859b70";
      break;
    case "ETH":
      return "0x";
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
      return "0x0000000000000000000000000000000000001010";
      break;
    case "ETH":
      return "0x";
      break;
    case "BNB":
      return "0x";
      break;
    default:
      return -1;
  }
}
