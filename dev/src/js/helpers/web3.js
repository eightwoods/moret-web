import Big from "big.js"
import { tokenAddress } from "./constant"
import { getJsonUrl, moretAddress, exchangeAddress, maxAmount } from "./utils"
import { getDelta, getGamma, getVega, getTheta } from 'greeks'

export const web3 = new Web3(window.ethereum)

export const getContract = async (web3, path, address) => {
    const response = await fetch(path)
    const data = await response.json()

    return new web3.eth.Contract(data.abi, address)
}

// 1. quote prices
export const getPriceOracle = async(tokenAddress) =>{
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress())
    const oracleAddress = await moretContract.methods.getVolatilityChain(String(tokenAddress)).call()
    const oracle = await getContract(web3, getJsonUrl("VolatilityChain.json"), oracleAddress)
    return oracle
}

export const getPrice = async (tokenAddress) => {
    const oracle = await getPriceOracle(tokenAddress)
    const tokenPrice = await oracle.methods.queryPrice().call()

    return `$${Big(web3.utils.fromWei(tokenPrice)).round(2).toNumber()}`
}

// 2. refresh strikes
export const getStrikes = async (tokenAddress) =>{
    const oracle = await getPriceOracle(tokenAddress)
    const tokenPrice = await oracle.methods.queryPrice().call()
    const tokenPriceNumber = parseFloat(web3.utils.fromWei(tokenPrice));

    const strikeMoneyness = [0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.3, 1.4]
    const minInterval = 50
    var strikeDict = {}
    for (let i = 0; i < strikeMoneyness.length; i++) {
        let strike = Math.round((tokenPriceNumber * strikeMoneyness[i]) / minInterval) * minInterval
        strikeDict[strikeMoneyness[i]] = strike
    }
    return strikeDict
}

// 3. calculate moneyness: strike is the floating number from strike field; isCall is true if Call is chosen, otherwise false
export const calcMoneyness = async(tokenAddress, strike, isCall) =>{
    const oracle = await getPriceOracle(tokenAddress)
    const tokenPrice = await oracle.methods.queryPrice().call()
    const tokenPriceNumber = parseFloat(web3.utils.fromWei(tokenPrice))
    const moneyness = Math.round(strike / tokenPriceNumber * 100)

    if(moneyness == 100){
        return 'ATM'
    }
    else if (moneyness > 100){
        return (moneyness - 100).toString() + (isCall? '% ITM': '% OTM')
    }
    else {
        return (100 - moneyness).toString() + (isCall ? '% OTM' : '% ITM')
    }
}

// 4. calculate iv for each strike: expiry is the option expiry in number of days
export const calcIV = async (tokenAddress, expiry) =>{
    const oracle = await getPriceOracle(tokenAddress)
    const tenor = Math.floor(expiry * 86400) // convert to seconds
    const timeToExpiry = expiry / 365
    const volatility = await oracle.methods.queryVol(tenor).call()
    return (parseFloat(web3.utils.fromWei(volatility)) / Math.sqrt(timeToExpiry)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })
}

// 5. refresh vol token name: it returns the name of volatility token and blank '' string if the vol token does not exist, in which case please remove the vol token from the selector
export const getVolTokenName = async(tokenAddress, expiry)=>{
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress())
    const tenor = Math.floor(expiry * 86400) // convert to seconds
    try{
        const volTokenAddress = await moretContract.methods.getVolatilityToken(tokenAddress, tenor).call()
        const volToken = await getContract(web3, getJsonUrl("VolatilityToken.json"), volTokenAddress)
        const volTokenName = await volToken.methods.symbol().call()
        return volTokenName
    }
    catch(err){
        return ''
    }
}

// 6. calculate option prices (including vol, premium and collateral) depending on parameters:
// isBuy is true if Buy is selected, otherwise false
// isCall is true if Call is selected, false if Put is selected
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// amount is in float
// expiry is in number of days
export const calcOptionPrice = async(tokenAddress, isBuy, isCall, paymentMethod, strike, amount, expiry) =>{
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress())
    const tenor = Math.floor(expiry * 86400)
    const allPools = await getAllPools(tokenAddress)
    var bestPool = (0).toString(16)
    var premium, collateral, price, vol

    for(let i =0;i< allPools.length; i++){
        const poolAddress = allPools[i]
        const quotedPrice = await exchangeContract.methods.queryOption(poolAddress, tenor, web3.utils.toWei(strike.toString(),'ether'), web3.utils.toWei(amount.toString(),'ether'), isCall? 0: 1, isBuy? 0: 1, false).call()
        const quotedPremium = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[0])))
        if (parseInt(bestPool, 16)==0){
            premium = quotedPremium
            collateral = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[1])))
            price = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[2])))
            vol = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[3])))
            bestPool = poolAddress
        }
        else if ((isBuy && (quotedPremium < premium)) || (!(isBuy) && (quotedPremium > premium)) ){
            premium = quotedPremium
            collateral = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[1])))
            price = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[2])))
            vol = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[3])))
            bestPool = poolAddress
        }
    }

    if (paymentMethod == 0){ 
        // do nothing
    }
    else if (paymentMethod == 1){
        premium = premium / price
        collateral = collateral / price
    }
    else if (paymentMethod == 2){
        premium = premium / vol 
        // note that if vol token is used to pay premium, USDC will be used as collateral
    }

    return [premium, collateral, vol, bestPool]
}

export const getAllPools = async (tokenAddress) => {
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress())
    const brokerAddress = await moretContract.methods.broker().call()
    const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const allPools = await brokerContract.methods.getAllPools(tokenAddress).call()
    return allPools
}

// 7. refresh total gross capital and utility in decimals
export const getCapital = async (tokenAddress) => {
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress())
    const vaultAddress = await exchangeContract.methods.vault().call()
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)

    const allPools = await getAllPools(tokenAddress)
    var grossCapitalTotal = 0
    var netCapitalTotal = 0
    for (let i = 0; i < allPools.length; i++) {
        const poolAddress = allPools[i]
        const grossCapital = await vaultContract.methods.calcCapital(poolAddress, false, false).call()
        const netCapital = await vaultContract.methods.calcCapital(poolAddress, true, false).call()
        grossCapitalTotal = grossCapitalTotal + parseFloat(web3.utils.fromWei(grossCapital))
        netCapitalTotal = netCapitalTotal + parseFloat(web3.utils.fromWei(netCapital))
    }
    return [grossCapitalTotal, Math.max(0, 1 - netCapitalTotal/grossCapitalTotal)]
}

// 8. execute option trade 
export const executeOptionTrade = async (tokenAddress, isBuy, isCall, paymentMethod, strike, amount, expiry) => {
    // 1sat step: check if allowance exists for the amount of premium and collateral.
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress())
    const optionCost = await calcOptionPrice(tokenAddress, isBuy, isCall, paymentMethod, strike, amount, expiry)
    const poolAddress = web3.utils.toChecksumAddress(optionCost[3]) 
    const fundingAddress = await moretContract.methods.funding().call()
    const tenor = Math.floor(expiry * 86400) // convert to seconds

    var paymentTokenAddress = paymentMethod == 0 ? fundingAddress : tokenAddress
    if (paymentMethod == 2) {    
        try {
            paymentTokenAddress = await moretContract.methods.getVolatilityToken(tokenAddress, tenor).call()
        }
        catch (err) {
            console.log('no vol token exists for ' + expiry.toString())
        }
    }
    const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), paymentTokenAddress)
    const fundingToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    await approveMaxAmmount(paymentToken, account, exchangeAddress(), optionCost[0])
    await approveMaxAmmount(fundingToken, account, exchangeAddress(), optionCost[1])

    // 2nd step: to execute the option contract
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress())
    var gasPriceCurrent = await web3.eth.getGasPrice();
    var gasEstimated = await exchangeContract.methods.tradeOption(poolAddress, tenor, web3.utils.toWei(strike.toString()), web3.utils.toWei(amount.toString()), isCall? 0: 1, isBuy? 0: 1).estimateGas({ from: account, gasPrice: gasPriceCurrent });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);
    await exchangeContract.methods.tradeOption(poolAddress, tenor, web3.utils.toWei(strike.toString()), web3.utils.toWei(amount.toString()), isCall ? 0 : 1, isBuy ? 0 : 1).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew });
}

// function to approve max amount if needed
export const approveMaxAmmount = async(erc20Token, account, spenderAddress, spendAmount) => {
    var approvedAmount = await erc20Token.methods.allowance(account, spenderAddress).call();
    // console.log(approvedAmount, spendAmount);
    if (spendAmount.gt(web3.utils.toBN(approvedAmount))) {
        var gasPriceApproval = await web3.eth.getGasPrice();
        var gasEstimatedApproval = await erc20Token.methods.approve(spenderAddress, maxAmount()).estimateGas({ from: account, gasPrice: gasPriceApproval });
        gasEstimatedApproval = Number(web3.utils.toBN(gasEstimatedApproval).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
        var nonceNewAproval = await web3.eth.getTransactionCount(account);
        await erc20Token.methods.approve(spenderAddress, maxAmount()).send({ from: account, gas: gasEstimatedApproval, gasPrice: gasPriceApproval, nonce: nonceNewAproval });
        console.log('cost approved', erc20Token._address, spenderAddress, maxAmount());
    }
}

// 9. read historical transactions: fromBlockNumber is integer of starting block number, can be zero
export const getPastTransactions = async (tokenAddress, fromBlockNumber) =>{
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress())
    const vaultAddress = await exchangeContract.methods.vault().call
    const vaultContract = await getCapital(web3, getJsonUrl("OptionVault.json"), vaultAddress)
    const accounts = await web3.eth.getAccounts();

    var optionTable = {}
    const oracle = await getPriceOracle(tokenAddress)
    const tokenPrice = await oracle.methods.queryPrice().call()
    const tokenPriceNumber = parseFloat(web3.utils.fromWei(tokenPrice));
    exchangeContract.getPastEvents('NewOption', { filter: { _purchaser: accounts[0], _underlying: tokenAddress }, fromBlock: fromBlockNumber, toBlock: 'latest' }, async function (error, events) { 
        for(let i = 0;i< events.length; i++){
            const optionId = events[i].returnValues._optionId
            const option = await vaultContract.methods.getOption(optionId).call()
            var optionData = {}
            const optionStrike = parseFloat(web3.utils.fromWei(option.strike))
            const optionAmount = parseFloat(web3.utils.fromWei(option.strike))
            const secondsToExpiry = Math.floor((option.maturity * 1000 - Date.now()) / 1000)
            const timeToExpiry = Math.floor(secondsToExpiry / 31536000)
            const impliedVol = secondsToExpiry <= 0 ? 0: await oracle.methods.queryVol(secondsToExpiry).call() 

            optionData['Type'] = option.poType == 0? 'Call': 'Put'
            optionData['B/S'] = option.side == 0? 'Buy': 'Sell'
            optionData['Expiry'] = new Date(option.maturity * 1000).toLocaleDateString()
            optionData['Strike'] = optionStrike.toFixed(2)
            optionData['Amount'] = optionAmount.toFixed(2)
            optionData['Delta'] = timeToExpiry <= 0 ? 0 : getDelta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0? 1: -1)
            optionData['Gamma'] = timeToExpiry <= 0 ? 0 : getGamma(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1)
            optionData['Vega'] = timeToExpiry <= 0 ? 0 : getVega(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1)
            optionData['Theta'] = timeToExpiry <= 0 ? 0 : getTheta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0 ? 1 : -1)

            optionTable.push(optionData)
        }
    })
    return optionTable
}

// 11. quote vol prices depending on parameters:
// isBuy is true if Buy is selected, otherwise false
// amount is in float number of USDC if isBuy is true, it is number of vol token if isBuy is false
// expiry is in number of days
// return 1) amount of vol token if isBuy is true, or amount of USDC if is Buy is false, and 2) the pool address for best pricing
export const calcVolTokenPrice = async (tokenAddress, isBuy, tradeAmount, expiry) => {
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress())
    const oracle = await getPriceOracle(tokenAddress)
    const tenor = Math.floor(expiry * 86400)
    const timeToExpiry = expiry / 365
    const oracleVol = await oracle.methods.queryVol(tenor).call()
    const tokenPrice = await oracle.methods.queryPrice().call()
    const allPools = await getVolTradingPools(tokenAddress)
    if(allPools.length > 0){
        const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress())
        try {
            const volTokenAddress = await moretContract.methods.getVolatilityToken(tokenAddress, tenor).call()
            const volToken = await getContract(web3, getJsonUrl("VolatilityToken.json"), volTokenAddress)

            var optionAmount = isBuy ? (tradeAmount / parseFloat(web3.utils.fromWei(oracleVol)) * Math.sqrt(timeToExpiry) / 0.4) : (tradeAmount / 0.4)
            var bestPool = (0).toString(16)
            var amount = 0
            for (let i = 0; i < allPools.length; i++) {
                const poolAddress = allPools[i]
                const quotedPrice = await exchangeContract.methods.queryOption(poolAddress, tenor, tokenPrice, web3.utils.toWei(optionAmount.toString(), 'ether'), 0, isBuy ? 0 : 1, true)

                const quotedPremium = parseFloat(web3.utils.fromWei(quotedPrice[0]))
                const quotedVol = parseFloat(web3.utils.fromWei(quotedPrice[3]))
                if(isBuy){
                    const mintAmount = await volToken.methods.getMintAmount(quotedPrice[0], quotedPrice[3]).call()
                    const mintAmountScaled = parseFloat(web3.utils.fromWei(mintAmount)) * (tradeAmount / quotedPremium)
                    if(mintAmountScaled > amount){
                        amount = mintAmountScaled
                        bestPool = poolAddress
                    }
                }
                else{
                    const burnAmount = await volToken.methods.getBurnAmount(quotedPrice[0], quotedPrice[3]).call()
                    const returnAmountScaled = quotedPremium * (tradeAmount / parseFloat(web3.utils.fromWei(burnAmount)))
                    if (returnAmountScaled > amount) {
                        amount = returnAmountScaled
                        bestPool = poolAddress
                    }
                }
            }
        }
        catch (err) {
            console.log('no vol token exists for ' + expiry.toString())
        }
    }
    else{
        console.log('There is no pools ready for quoting vols');
    }

    return amount, bestPool
}

export const getVolTradingPools = async (tokenAddress) => {
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress())
    const brokerAddress = await moretContract.methods.broker().call()
    const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const allPools = await brokerContract.methods.getAllPools(tokenAddress).call()
    var volTradingPools = []
    for(let i = 0;i<allPools.length; i++){
        const eligible = await moretContract.methods.existVolTradingPool(allPools[i]).call()
        if(eligible){
            volTradingPools.push(allPools[i])
        }
    }
    return volTradingPools
}

// 12. trade vol tokens 


// 13. list all pools with their features


// 14. invest in a selected pool

// 15. divest from a selected pool

// 14. governance functions