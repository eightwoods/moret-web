import Big from "big.js"
import { moretAddress, exchangeAddress, vaultAddress, marketMakerFactoryAddress, poolFactoryAddress, poolGovFactoryAddress, maxAmount, tokenAddress, stableCoinAddress, expirationDays, excludedPools, poolList, fixedIndexList } from "./constant"
import { getJsonUrl } from "./utils"
import { getDelta, getGamma, getVega, getTheta } from "greeks"

export const web3 = new Web3(window.ethereum)

export const getContract = async(web3, path, address) => {
    const response = await fetch(path)
    const data = await response.json()
    
    return new web3.eth.Contract(data.abi, address)
}

// 1. quote prices
export const getPriceOracle = async(tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const oracleAddress = await moretContract.methods.getVolatilityChain(String(objTokenAddr)).call()
    const oracle = await getContract(web3, getJsonUrl("VolatilityChain.json"), oracleAddress)

    return oracle
}

export const getPrice = async(tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const oracle = await getPriceOracle(objTokenAddr)
    const tokenPrice = await oracle.methods.queryPrice().call()

    return `$${Big(web3.utils.fromWei(tokenPrice)).round(2).toNumber()}`
}

// 2. refresh strikes
// isCall is true if Call is chosen, otherwise false
export const getStrikes = async(tokenAddr = null, isCall) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const oracle = await getPriceOracle(objTokenAddr)
    const tokenPrice = await oracle.methods.queryPrice().call()
    const tokenPriceNumber = Big(web3.utils.fromWei(tokenPrice)).toNumber()
    const strikeMoneyness = [0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.3, 1.4]
    const minInterval = 50
    const strikeDict = []

    for (let strikeMoney of strikeMoneyness) {
        let strike = Big(tokenPriceNumber)
        .times(strikeMoney)
        .div(minInterval)
        .round()
        .times(minInterval)
        .toNumber()

        let strikeMoneynessVal = await calcMoneyness(objTokenAddr, strike, isCall)
        strikeDict.push(`${strike} | ${strikeMoneynessVal}`)
    }

    return strikeDict
}

// 3. calculate moneyness: strike is the floating number from strike field; 
// isCall is true if Call is chosen, otherwise false
export const calcMoneyness = async(tokenAddr = null, strike, isCall) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const oracle = await getPriceOracle(objTokenAddr)
    const tokenPrice = await oracle.methods.queryPrice().call()
    const tokenPriceNumber = Big(web3.utils.fromWei(tokenPrice)).toNumber()
    const moneyness = Big(strike).div(tokenPriceNumber).times(100).round().toNumber()

    if (moneyness === 100) {
        return "ATM"
    } else if (moneyness > 100) {
        return `${(moneyness - 100).toString()}${isCall ? "% OTM" : "% ITM"}`
    } else {
        return `${(100 - moneyness).toString()}${isCall ? "% ITM" : "% OTM"}`
    }
}

// 4. calculate iv for each strike: expiry is the option expiry in number of days
export const calcIV = async(tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const oracle = await getPriceOracle(objTokenAddr)
    // const expirationDays = [1, 7, 30]
    let expirations = []

    for (let expiry of expirationDays) {
        const tenor = Big(expiry).times(86400).round().toNumber() // convert to seconds
        const timeToExpiry = Big(expiry).div(365)
        const volatility = await oracle.methods.queryVol(tenor).call()
        const calcValue = `${Big(web3.utils.fromWei(volatility))
                        .div(timeToExpiry.sqrt())
                        .toNumber()
                        .toLocaleString(undefined, {style: "percent", minimumFractionDigits: 0})} RV`

        const gtDay = Big(expiry).eq(1) ? "" : "s"

        expirations.push(`${expiry} Day${gtDay} | ${calcValue}`)
    }
    
    return expirations    
}

// 5. refresh vol token name: it returns the name of volatility token and blank '' string if the vol token does not exist, in which case please remove the vol token from the selector
// expiry is number of days
export const getVolTokenName = async(tokenAddr = null, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const tenor = Big(expiry).times(86400).round().toNumber() // convert to seconds
    
    try {
        const volTokenAddress = await moretContract.methods.getVolatilityToken(objTokenAddr, tenor).call()
        const volTokenContract = await getContract(web3, getJsonUrl("VolatilityToken.json"), volTokenAddress)
        const volTokenName = await volTokenContract.methods.symbol().call()
        return volTokenName
    } catch(err) {
        return ""
    }
}
// ----- currently refactor methods above !!! -----
//

// 6. calculate option prices (including vol, premium and collateral) depending on parameters:
// isBuy is true if Buy is selected, otherwise false
// type is 0 if Call, 2 if Put, 3 if Call Spread and 4 if Put Spread
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// spread is in integer
// amount is in float
// expiry is in number of days
// outputReceipt is true if the output is used in receipt popup; it is false if the output is used on trading page
export const calcOptionPrice = async(tokenAddr = null, token = null, isBuy, type, paymentMethod, strike, spread, amount, expiry) => {
    // try {
    if (strike<=0){
        throw 'Strike not set correctly.'
    }
    if(expiry <= 0){
        throw 'Expiry not set correctly'
    }


    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    const tenor = Math.floor(expiry * 86400)
    const allPools = await getAllPools(objTokenAddr)

    var bestPool = (0).toString(16)
    var premium, collateral, fee
    var vol = 0
    var price = 0

    for(let i =0;i< allPools.length; i++){
        const poolAddress = allPools[i]
        const quotedPrice = await getOptionPriceOfPool(exchangeContract, poolAddress, tenor, web3.utils.toWei(strike.toString(), 'ether'), web3.utils.toWei(spread.toString(), 'ether'), web3.utils.toWei(amount.toString(), 'ether'), type, isBuy ? 0 : 1)
        console.log(quotedPrice)

        if(quotedPrice[0] != -1){
            const quotedPremium = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[0])))
            
            if (parseInt(bestPool, 16)==0){
                premium = quotedPremium
                collateral = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[1])))
                price = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[2])))
                vol = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[3])))
                fee = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[4])))
                bestPool = poolAddress
            }
            else if ((isBuy && (quotedPremium < premium)) || (!(isBuy) && (quotedPremium > premium)) ){
                premium = quotedPremium
                collateral = isBuy ? 0 : parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[1])))
                price = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[2])))
                vol = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[3])))
                fee = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[4])))
                bestPool = poolAddress
            }

            // console.log(poolAddress, isBuy, type, paymentMethod, strike, spread, premium, collateral, price, vol)
        }
    }

    if(vol==0 || price ==0)
    {
        throw 'There is no available liquidity pool.'
    }

    var premiumToken = "USDC"
    var collateralToken = "USDC"
    if (paymentMethod == 0){ 
        // do nothing
    }
    else if (paymentMethod == 1){
        premium = premium / price
        collateral = collateral / price
        premiumToken = collateralToken = token
    }
    else if (paymentMethod == 2){
        premium = premium / vol 
        premiumToken = await getVolTokenName(objTokenAddr, expiry)
        // note that if vol token is used to pay premium, USDC will be used as collateral
    }

    if (token) {
        return {
            "volatility": vol.toLocaleString(undefined, {style: "percent", minimumFractionDigits: 0}),
            "premium": `${Big(premium).round(5)} ${premiumToken}`,
            "collateral": `${Big(collateral).round(2)} ${collateralToken}`,
            "fee": `${Big(collateral).round(2)} ${collateralToken}`,
            "error": ''
        }
    } else {
        return {
            "volatility": vol,
            "premium": premium,
            "collateral": collateral,
            "pool": bestPool,
            "error": ''
        }
    }
    // } catch(err) {
    //     return {
    //         "volatility": "-",
    //         "premium": "-",
    //         "collateral": "-",
    //         "error": err.message
    //     }
    // }    
}

// function to get option price of a specific pool
// isBuy is true if Buy is selected, otherwise false
// type is 0 if Call, 2 if Put, 3 if Call Spread and 4 if Put Spread
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
export const getOptionPriceOfPool = async (exchangeContract, poolAddress, tenor, strike, spread, amount, type, isBuy) => {
    try{
        console.log(poolAddress, tenor, strike, spread, amount, type, isBuy)
        const quotedPrice = await exchangeContract.methods.queryOption(poolAddress, tenor, strike, spread, amount, type, isBuy).call()
        // console.log(poolAddress, quotedPrice)
        return quotedPrice
    } catch(err){
        return [-1]
    }
    
}

export const getAllPools = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    // const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    // const brokerAddress = await moretContract.methods.broker().call()
    // const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    // var allPools = await brokerContract.methods.getAllPools(objTokenAddr).call()
    // allPools = allPools.filter((el) => !excludedPools.includes(el));
    // return allPools
    return (objTokenAddr in poolList) ? poolList[objTokenAddr] : [] 
}

// 7. refresh total gross capital and utility in decimals
export const getCapital = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)

    const allPools = await getAllPools(objTokenAddr)
    var grossCapitalTotal = 0
    var netCapitalTotal = 0
    for (let i = 0; i < allPools.length; i++) {
        const poolAddress = allPools[i]
        const grossCapital = await vaultContract.methods.calcCapital(poolAddress, false, false).call()
        const netCapital = await vaultContract.methods.calcCapital(poolAddress, true, false).call()
        grossCapitalTotal = grossCapitalTotal + parseFloat(web3.utils.fromWei(grossCapital))
        netCapitalTotal = netCapitalTotal + parseFloat(web3.utils.fromWei(netCapital))
        // console.log(poolAddress, grossCapital, netCapital)
    }
    const utilizedCapital = grossCapitalTotal - netCapitalTotal
    const utilization = Math.max(0, 1 - netCapitalTotal / grossCapitalTotal)
    // console.log('capital', grossCapitalTotal, netCapitalTotal, utilization, utilization.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 }))
    // return [`$${(grossCapitalTotal / 1000)}K`, utilization.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 }) + " of the liquidity pools utilized" ]
    return {
        "gross": `$${(grossCapitalTotal / 1000).toFixed(1)}K`,
        "utilized": `$${(utilizedCapital / 1000).toFixed(1)}K`,
        "perc": utilization * 100 ,
        "text": utilization.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })
    }
}

// 8a. function to approve max amount if needed
// isBuy is true if Buy is selected, otherwise false
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// spread is in integer
// amount is in float
// expiry is in number of days
export const approveOptionSpending = async (tokenAddr = null, isBuy, type, paymentMethod, strike, spread, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const brokerAddress = await moretContract.methods.broker().call()
    const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const optionCost = await calcOptionPrice(objTokenAddr, null, isBuy, type, paymentMethod, strike, spread, amount, expiry)
    console.log(optionCost)
    const fundingAddress = await brokerContract.methods.funding().call()
    const tenor = Math.floor(expiry * 86400) // convert to seconds

    var paymentTokenAddress = paymentMethod == 0 ? fundingAddress : objTokenAddr
    if (paymentMethod == 2) {
        try {
            paymentTokenAddress = await moretContract.methods.getVolatilityToken(objTokenAddr, tenor).call()
        }
        catch (err) {
            console.log(`no vol token exists for ${expiry.toString()}`)
        }
    }
    const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), paymentTokenAddress)
    const collateralToken = await getContract(web3, getJsonUrl("ERC20.json"), paymentMethod == 1 ? objTokenAddr: fundingAddress)

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    try {
        await approveMaxAmount(paymentToken, account, exchangeAddress, optionCost['premium'])
        if (collateralToken._address != paymentToken._address){
            await approveMaxAmount(collateralToken, account, exchangeAddress, optionCost['collateral'])
        }
    }
    catch (err) {
        console.warn(err)
        return "failure"
    }
}

export const approveMaxAmount = async (erc20Token, account, spenderAddress, spendAmount) => {
    var approvedAmount = await erc20Token.methods.allowance(account, spenderAddress).call()
    const tokenDecimals = await erc20Token.methods.decimals().call()
    const spendAmountInWei = web3.utils.toBN(web3.utils.toWei(spendAmount.toFixed(18))).div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(tokenDecimals))))
    // console.log(approvedAmount, Number(tokenDecimals), spendAmount, web3.utils.fromWei(spendAmountInWei), spendAmountInWei.gt(approvedAmount), spendAmountInWei.gt(web3.utils.toBN(approvedAmount)));
    if (spendAmountInWei.gt(web3.utils.toBN(approvedAmount))) {
        var gasPriceApproval = await web3.eth.getGasPrice()
        var gasEstimatedApproval = await erc20Token.methods.approve(spenderAddress, maxAmount).estimateGas({ from: account, gasPrice: gasPriceApproval })
        gasEstimatedApproval = Number(web3.utils.toBN(gasEstimatedApproval).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))))
        var nonceNewAproval = await web3.eth.getTransactionCount(account)
        await erc20Token.methods.approve(spenderAddress, maxAmount).send({
            from: account, 
            gas: gasEstimatedApproval, 
            gasPrice: gasPriceApproval, 
            nonce: nonceNewAproval
        });
        // console.log("cost approved", erc20Token._address, spenderAddress, maxAmount)
    }
}

// 8b. execute option trade 
// isBuy is true if Buy is selected, otherwise false
// type is 0 if Call, 2 if Put, 3 if Call Spread and 4 if Put Spread
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// spread is in integer
// amount is in float
// expiry is in number of days
export const executeOptionTrade = async (tokenAddr = null, isBuy, type, paymentMethod, strike, spread, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const optionCost = await calcOptionPrice(objTokenAddr, null, isBuy, type, paymentMethod, strike, spread, amount, expiry)
    const poolAddress = web3.utils.toChecksumAddress(optionCost['pool']) 
    const tenor = Math.floor(expiry * 86400) // convert to seconds

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    
    try {
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        var gasPriceCurrent = await web3.eth.getGasPrice()
        var gasEstimated = await exchangeContract.methods.tradeOption(
            poolAddress, 
            tenor, 
            web3.utils.toWei(strike.toString()), 
            0,
            web3.utils.toWei(amount.toString()), 
            type, 
            isBuy ? 0 : 1, 
            paymentMethod).estimateGas({ from: account, gasPrice: gasPriceCurrent }
        )
        gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))))
        var nonceNew = await web3.eth.getTransactionCount(account)

        let approveTradeLink = null
        await exchangeContract.methods.tradeOption(poolAddress, tenor, web3.utils.toWei(strike.toString()), 0, web3.utils.toWei(amount.toString()), type, isBuy ? 0 : 1, paymentMethod).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
            // console.log(`https://polygonscan.com/tx/${hash}`)
            // return `https://polygonscan.com/tx/${hash}`
            approveTradeLink = `https://polygonscan.com/tx/${hash}`
        }).on('error', function (error, receipt) {
            return ""
        })

        return approveTradeLink
    }
    catch (err) {
        console.warn(err)
        return ""
    }
}

// 9. read historical transactions: fromBlockNumber is integer of starting block number, can be zero
export const getPastTransactions = async (tokenAddr = null, blockRange = 9000, endBlock = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
    
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0]) 
    // console.log('transactions for ', account)

    const oracle = await getPriceOracle(objTokenAddr)
    const tokenPrice = await oracle.methods.queryPrice().call()
    const tokenPriceNumber = parseFloat(web3.utils.fromWei(tokenPrice)); 
    const latestBlock = await web3.eth.getBlockNumber()
    const fromBlock = (endBlock ? endBlock : latestBlock) - blockRange
    // console.log('block', fromBlock, latestBlock, endBlock)
    let resEvents = null
    await exchangeContract.getPastEvents('NewOption', { filter: { _purchaser: account, _underlying: objTokenAddr }, fromBlock: fromBlock, toBlock: endBlock ? endBlock : latestBlock }, async (err, events) => { 
        resEvents = events
    })
    
    // best approach illiterate array value and for iteration
    let optionTable = []
    for (let i = 0; i < resEvents.length; i++) {
        const optionId = resEvents[i].returnValues._optionId
        const option = await vaultContract.methods.getOption(optionId).call()
        const optionStrike = parseFloat(web3.utils.fromWei(option.strike))
        const optionSpread = parseFloat(web3.utils.fromWei(option.spread))
        const optionAmount = parseFloat(web3.utils.fromWei(option.amount))
        const secondsToExpiry = Math.floor((option.maturity * 1000 - Date.now()) / 1000)
        const timeToExpiry = secondsToExpiry / (3600 * 24 * 365)
        const impliedVol = secondsToExpiry <= 0 ? 0 : await oracle.methods.queryVol(secondsToExpiry).call()
        const value = await vaultContract.methods.calcOptionUnwindValue(optionId).call()
        // console.log(i, secondsToExpiry, timeToExpiry)
        optionTable.push({
            "Type": option.poType == 0 ? "Call" : "Put",
            "BS": option.side == 0 ? "Buy" : "Sell",
            "Expiry": new Date(option.maturity * 1000).toLocaleString(),
            "Strike": optionStrike.toFixed(0),
            "Spread": optionSpread.toFixed(0),
            "Amount": optionAmount.toFixed(3),
            "Value": parseFloat(web3.utils.fromWei(value)).toFixed(3),
            "Delta": (timeToExpiry <= 0 ? 0 : getDelta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0 ? 1 : -1) * optionAmount).toFixed(3),
            "Gamma": (timeToExpiry <= 0 ? 0 : getGamma(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1) * optionAmount).toFixed(3),
            "Vega": (timeToExpiry <= 0 ? 0 : getVega(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1) * optionAmount).toFixed(3),
            "Theta": (timeToExpiry <= 0 ? 0 : getTheta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0 ? 1 : -1) * optionAmount).toFixed(3),
        })
    }
    // console.log(optionTable)
    return optionTable
}

export const getActiveTransactions = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)

    const oracle = await getPriceOracle(objTokenAddr)
    var spot = await oracle.methods.queryPrice().call();
    var spotPrice = parseFloat(web3.utils.fromWei(spot));

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    
    const allPools = await getAllPools(objTokenAddr)
    let optionTable = []
    var ts = Math.round((new Date()).getTime() / 1000); // current UNIX timestamp in seconds

    await Promise.all(allPools.map(async (poolAddress) => {
        const options = await vaultContract.methods.getHolderOptions(poolAddress, account).call();
        await Promise.all(options.map(async (optionId) => {
            let option = await vaultContract.methods.getOption(optionId).call();
            let secondsToExpiry = Math.floor(option.maturity - ts);
            let timeToExpiry = secondsToExpiry / (3600 * 24 * 365);
            let optionStrike = parseFloat(web3.utils.fromWei(option.strike));
            let optionSpread = parseFloat(web3.utils.fromWei(option.spread))
            let optionAmount = parseFloat(web3.utils.fromWei(option.amount))
            let optionPremium = parseFloat(web3.utils.fromWei(option.premium))
            let optionType = "call";
            switch(option.poType){
                case 1:
                    optionType = "put";
                    break;
                case 2:
                    optionType = "call spread";
                    break;
                default:
                    optionType = "put spread";
            }
            let optionMultiplier = option.side == 0 ? 1 : -1;
            let optionDelta, optionGamma, optionVega, optionTheta;
            if (secondsToExpiry > 0) {
                let impliedVol = await oracle.methods.queryVol(secondsToExpiry).call();
                let annualVol = parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry);
                optionDelta = getDelta(spotPrice, optionStrike, timeToExpiry, annualVol, 0, optionType) * optionMultiplier * optionAmount;
                optionGamma = getGamma(spotPrice, optionStrike, timeToExpiry, annualVol, 0) * optionMultiplier * optionAmount;
                optionVega = getVega(spotPrice, optionStrike, timeToExpiry, annualVol, 0) * optionMultiplier * optionAmount;
                optionTheta = getTheta(spotPrice, optionStrike, timeToExpiry, annualVol, 0, optionType) * optionMultiplier * optionAmount;
                let optionValue = await vaultContract.methods.calcOptionUnwindValue(optionId).call()
                let optionPnL = (parseFloat(web3.utils.fromWei(optionValue._toHolder)) - optionPremium) * optionMultiplier
            
                optionTable.push({
                    "Type": option.poType == 0 ? "Call" : "Put",
                    "BS": option.side == 0 ? "Buy" : "Sell",
                    "Expiry": new Date(option.maturity * 1000).toLocaleString(),
                    "Strike": optionStrike.toFixed(0),
                    "Spread": optionSpread.toFixed(0),
                    "Amount": optionAmount.toFixed(3),
                    "PnL": optionPnL.toFixed(3),
                    "Delta": optionDelta.toFixed(3),
                    "Gamma": optionGamma.toFixed(3),
                    "Vega": optionVega.toFixed(3),
                    "Theta": optionTheta.toFixed(3),
            })}}));
    }));

    // console.log(optionTable)
    return optionTable
}

// 10. quote vol prices depending on parameters:
// isBuy is true if Buy is selected, otherwise false
// amount is in float number of USDC
// expiry is in number of days
// return 1) amount of vol token if isBuy is true, or amount of USDC if is Buy is false, and 2) the pool address for best pricing
export const calcVolTokenPrice = async (tokenAddr = null, token = null, isBuy, amount, expiry) => {
    try{
        if (expiry <= 0) {
            throw 'Expiry not set correctly'
        }

        const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)

        const oracle = await getPriceOracle(objTokenAddr)
        const tenor = Math.floor(expiry * 86400)
        const timeToExpiry = expiry / 365

        const oracleVol = await oracle.methods.queryVol(tenor).call()
        const oraclePrice = await oracle.methods.queryPrice().call()
        // console.log(parseFloat(web3.utils.fromWei(oracleVol)), parseFloat(web3.utils.fromWei(oraclePrice)), parseFloat(amount))
        const estimatedOptionAmount = parseFloat(amount) / parseFloat(web3.utils.fromWei(oracleVol)) / parseFloat(web3.utils.fromWei(oraclePrice)) / 0.4
        // console.log(estimatedOptionAmount)
        const allPools = await getVolTradingPools(objTokenAddr)
        // console.log(allPools)

        var volAmount, notional
        var vol = 0

        const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
        const volTokenAddress = await moretContract.methods.getVolatilityToken(objTokenAddr, tenor).call()
        const volTokenContract = await getContract(web3, getJsonUrl("VolatilityToken.json"), volTokenAddress)
        const volToken = await volTokenContract.methods.symbol().call()
        const premiumToken = "USDC"
        
        var bestPool = (0).toString(16)
        
        if (allPools.length==0){
            throw 'There is no available pool to trade volatility tokens with.'
        }
        
        for (let i = 0; i < allPools.length; i++) {
            const poolAddress = allPools[i]
            const quotedPrice = await getOptionPriceOfPool(exchangeContract, poolAddress, tenor, oraclePrice, web3.utils.toWei(estimatedOptionAmount.toFixed(18), 'ether'), 0, isBuy ? 0 : 1)
            // console.log(poolAddress, quotedPrice)

            if (quotedPrice[0] != -1){
                const quotedPremium = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[0])))
                const quotedVolatility = parseFloat(web3.utils.fromWei(quotedPrice[3]))
                const optionAmount = (isBuy ? quotedPremium : (quotedPremium / quotedVolatility)) / parseFloat(amount) * estimatedOptionAmount
                const forAmount = parseFloat(amount) / quotedVolatility

                if (parseInt(bestPool, 16) == 0) {
                    volAmount = forAmount
                    bestPool = poolAddress
                    vol = quotedVolatility
                    notional = optionAmount
                }
                else if (volAmount < forAmount) {
                    volAmount = forAmount
                    bestPool = poolAddress
                    vol = quotedVolatility
                    notional = optionAmount
                }
            }
            // if (isBuy) {
            //     const mintAmount = await volTokenContract.methods.getMintAmount(quotedPrice[0], quotedPrice[3]).call()
            //     const mintAmountScaled = parseFloat(web3.utils.fromWei(mintAmount)) * (tradeAmount / quotedPremium)
            //     if (mintAmountScaled > amount) {
            //         amount = mintAmountScaled
            //         bestPool = poolAddress
            //     }
            // }
            // else {
            //     const burnAmount = await volTokenContract.methods.getBurnAmount(quotedPrice[0], quotedPrice[3]).call()
            //     const returnAmountScaled = quotedPremium * (tradeAmount / parseFloat(web3.utils.fromWei(burnAmount)))
            //     if (returnAmountScaled > amount) {
            //         amount = returnAmountScaled
            //         bestPool = poolAddress
            //     }
            // }
            
        }

        if (token) {
            return {
                "volatility": vol.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 }),
                "premium": `${Big(amount).round(5)} ${premiumToken}`,
                "volpremium": `${Big(volAmount).round(5)} ${volToken}`
            }
        } else {
            return {
                "volatility": vol,
                "premium": amount,
                "volpremium": volAmount,
                "notional": notional,
                "voltoken": volTokenAddress,
                "pool": bestPool
            }
        }
    
    }
    catch(err){
        console.log(err.message)
        return {
            "volatility": "-",
            "premium": "-",
            "volpremium": "-",
            "error": err.message
        }
    }
}

export const getVolTradingPools = async (tokenAddress) => {
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    // const brokerAddress = await moretContract.methods.broker().call()
    // const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const allPools = await getAllPools(tokenAddress) // brokerContract.methods.getAllPools(tokenAddress).call()
    // console.log('test', allPools)
    var volTradingPools = []
    for(let i = 0;i<allPools.length; i++){
        const eligible = await moretContract.methods.existVolTradingPool(allPools[i]).call()
        if(eligible){
            volTradingPools.push(allPools[i])
        }
    }
    return volTradingPools
}

// 11a. function to approve max amount if needed
// isBuy is true if Buy is selected, otherwise false
// amount is in float
// expiry is in number of days
export const approveVolatilitySpending = async (tokenAddr = null, isBuy, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const brokerAddress = await moretContract.methods.broker().call()
    const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const volatilityCost = await calcVolTokenPrice(objTokenAddr, null, isBuy, amount, expiry)
    // console.log(volatilityCost)
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    if(isBuy){
        const fundingAddress = await brokerContract.methods.funding().call()
        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
        await approveMaxAmount(paymentToken, account, exchangeAddress, parseFloat(volatilityCost['premium']))
    }
    else{
        const volTokenAddress = web3.utils.toChecksumAddress(volatilityCost['voltoken'])
        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), volTokenAddress)
        await approveMaxAmount(paymentToken, account, exchangeAddress, parseFloat(volatilityCost['volpremium']))
    }
}

// 11b. trade vol tokens 
// isBuy is true if Buy is selected, otherwise false
// amount is in float
// expiry is in number of days
export const executeVolatilityTrade = async (tokenAddr = null, isBuy, amount, expiry) => {
    try{
        const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
        const volatilityCost = await calcVolTokenPrice(objTokenAddr, null, isBuy, amount, expiry)
        const poolAddress = web3.utils.toChecksumAddress(volatilityCost['pool'])
        const optionNotional = web3.utils.toWei(volatilityCost['notional'].toFixed(18), 'ether')
        const tenor = Math.floor(expiry * 86400) // convert to seconds

        var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
        var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        var gasPriceCurrent = await web3.eth.getGasPrice();
        var gasEstimated = await exchangeContract.methods.tradeVolToken(poolAddress, tenor, optionNotional, isBuy ? 0 : 1).estimateGas({ from: account, gasPrice: gasPriceCurrent });
        gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
        var nonceNew = await web3.eth.getTransactionCount(account);
        await exchangeContract.methods.tradeVolToken(poolAddress, tenor, optionNotional, isBuy ? 0 : 1).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
            console.log(`https://polygonscan.com/tx/${hash}`)
            return `https://polygonscan.com/tx/${hash}`
        }).on('error', function (error, receipt) {
            return ""
        })
    }
    catch(err){
        console.warn(err)
        return ""
    }
}

// 12. List all vol token holdings
export const getVolatilityHoldings = async (tokenAddr = null) =>{
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const oracleAddress = await moretContract.methods.getVolatilityChain(String(objTokenAddr)).call()
    const oracle = await getContract(web3, getJsonUrl("VolatilityChain.json"), oracleAddress)
    
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    let volatilityTable = []

    await Promise.all(expirationDays.map(async (expiry) => {
        try {
            const tenor = Big(expiry).times(86400).round().toNumber() // convert to seconds
            const timeToExpiry = expiry / 365 // converts to days
            const volatility = await oracle.methods.queryVol(tenor).call()
            const gtDay = Big(expiry).eq(1) ? "" : "s"
            const volTokenAddress = await moretContract.methods.getVolatilityToken(String(objTokenAddr), tenor).call()
            const volTokenContract = await getContract(web3, getJsonUrl("VolatilityToken.json"), volTokenAddress)
            const volTokenHolding = await volTokenContract.methods.balanceOf(account).call()
            const volTokenName = await volTokenContract.methods.symbol().call()
            const impliedVol = parseFloat(web3.utils.fromWei(volatility)) / Math.sqrt(timeToExpiry)
            volatilityTable.push({
                "Token": volTokenName,
                "Tenor": `${expiry} Day${gtDay}`,
                "Amount": parseFloat(web3.utils.fromWei(volTokenHolding)).toFixed(4),
                "ImpliedVolatility": impliedVol.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0}),
            })
        }
        catch (err) {
            console.log(err.message)
        }
    }))
    return volatilityTable
}

// 13. list all pools with their features 
export const getAllPoolsInfo = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    const allPools = await getAllPools(objTokenAddr)
    // console.log(allPools)
    // var grossCapitalTotal = 0
    // var netCapitalTotal = 0
    let poolTable = []

    await Promise.all(allPools.map(async (poolAddress) => {
    // for (let i = 0; i < allPools.length; i++) {
        // const poolAddress = allPools[i]
        const poolContract = await getContract(web3, getJsonUrl("Pool.json"), poolAddress)
        const marketAddress = await poolContract.methods.marketMaker().call()
        const marketContract = await getContract(web3, getJsonUrl("MarketMaker.json"), marketAddress)

        let blockId = await web3.eth.getBlockNumber()
        
        let netCapital = await vaultContract.methods.calcCapital(poolAddress, true, false).call(blockId)
        let supply = await poolContract.methods.totalSupply().call(blockId)
        // console.log(poolAddress, grossCapital, netCapital)
        const name = await poolContract.methods.name().call(blockId)
        // const symbol = await poolContract.methods.symbol().call(blockId)
        // let bot = await marketContract.methods.hedgingBot().call(blockId)
        let description = await marketContract.methods.description().call(blockId)
        
        let holding = await poolContract.methods.balanceOf(account).call(blockId)
        // let unitGrossCapital = await vaultContract.methods.calcCapital(poolAddress, false, true).call(blockId)
        // let unitNetCapital = await vaultContract.methods.calcCapital(poolAddress, true, true).call(blockId)

        // grossCapital = parseFloat(web3.utils.fromWei(grossCapital))
        netCapital = parseFloat(web3.utils.fromWei(netCapital))
        // const utilization = Math.max(0, 1 - netCapital / grossCapital)
        holding = parseFloat(web3.utils.fromWei(holding))
        // unitGrossCapital = parseFloat(web3.utils.fromWei(unitGrossCapital))
        let unitNetCapital = netCapital / parseFloat(web3.utils.fromWei(supply))
        // let heldCapital = unitGrossCapital * holding
        let heldNetCapital = unitNetCapital * holding

        
        let estyield = 2.2

        poolTable.push({
            "Name": name,
            "Address": poolAddress,
            "Description": web3.utils.hexToAscii(description),
            "MarketCap": `$${(netCapital).toFixed(0)}`,
            // "EstimatedYield": estyield.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 }),
            "UnitWithdrawable": `$${(unitNetCapital).toFixed(2)}`,
            // "HoldingBalance": `$${(heldCapital).toFixed(2)}`,
            "HoldingNetBalance": `$${(heldNetCapital).toFixed(2)}`, 
            "Holdings": holding.toFixed(0),
            })
    }))
    
    return poolTable
}

export const getPoolInfo = async (poolAddress, infoType) => {
    const accountsOnEnable = await ethereum.request({method: "eth_requestAccounts"})
    const account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    const poolContract = await getContract(web3, getJsonUrl("Pool.json"), poolAddress)
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
    switch (infoType){
        case 'name':
            const name = await poolContract.methods.name().call()
            return name
        case 'symbol':
            const symbol = await poolContract.methods.symbol().call()
            return symbol
        case 'description':
            let marketAddress = await poolContract.methods.marketMaker().call()
            let marketContract = await getContract(web3, getJsonUrl("MarketMaker.json"), marketAddress)
            const description = await marketContract.methods.description().call()
            return web3.utils.hexToAscii(description)
        // case 'bot':
        //     const bot = await marketContract.methods.hedgingBot().call()
        //     return bot.toString()
        case 'curve':
            const curveFactor = await poolContract.methods.volCapacityFactor().call()
            return parseFloat(web3.utils.fromWei(curveFactor)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })
        case 'fee':
            const exerciseFee = await poolContract.methods.exerciseFee().call()
            return parseFloat(web3.utils.fromWei(exerciseFee)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 })
        case 'minvol':
            const minVol = await poolContract.methods.minVolPrice().call()
            return parseFloat(web3.utils.fromWei(minVol)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 })
        case 'aum':
            const aum = await vaultContract.methods.calcCapital(poolAddress, true, false).call()
            return `$${(parseFloat(web3.utils.fromWei(aum))).toFixed(2)}`
        case 'navbid':
            const navbid = await vaultContract.methods.calcCapital(poolAddress, true, true).call()
            return `$${(parseFloat(web3.utils.fromWei(navbid))).toFixed(2)}`
        case 'navoffer':
            const navoffer = await vaultContract.methods.calcCapital(poolAddress, false, true).call()
            return `$${(parseFloat(web3.utils.fromWei(navoffer))).toFixed(2)}`
        case 'utilization':
            const grossExpo = await vaultContract.methods.calcCapital(poolAddress, false, false).call()
            const netExpo = await vaultContract.methods.calcCapital(poolAddress, true, false).call()
            return Math.max(0, 1 - parseFloat(web3.utils.fromWei(netExpo)) / parseFloat(web3.utils.fromWei(grossExpo))).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })
        case 'holding':
            const holding = await poolContract.methods.balanceOf(account).call()
            const nav = await vaultContract.methods.calcCapital(poolAddress, true, true).call()
            return [`${(parseFloat(web3.utils.fromWei(holding))).toFixed(2)}`, `$${(parseFloat(web3.utils.fromWei(nav)) * parseFloat(web3.utils.fromWei(holding))).toFixed(2)}`]
        default:
            return ''
    }
}

// 14. invest in a selected pool
// amount is the USDC amount to invest in pool
export const quoteInvestInPool = async (poolAddress, amount) => {
    // try {
        const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
        const grossCapital = await vaultContract.methods.calcCapital(poolAddress, false, true).call()
        const grossCapitalFloat = parseFloat(web3.utils.fromWei(grossCapital))
        const quoteInvest = grossCapitalFloat > 0 ? (amount / grossCapitalFloat): amount

        const poolContract = await getContract(web3, getJsonUrl("Pool.json"), poolAddress)
        const poolToken = await poolContract.methods.symbol().call()
        const premiumToken = 'USDC'

        return {
            'invest': `${Big(amount).round(5)} ${premiumToken}`,
            'holding': `${Big(quoteInvest).round(5)} ${poolToken}`
        }
    // }
    // catch (err) {
    //     return err.message
    // }
}

// amount is the USDC amount to invest in pool
export const approvePool = async (type, poolAddress, amount) => {
    let log = ""
    switch (type) {    
        case "takeout":
            log= await approveDivestFromPool(poolAddress, amount)
            break
        default:
            log = await approveInvestInPool(amount)
    }
    console.log('approve', log)
    return log
}

export const tradePool = async (type, poolAddress, amount, poolParams) => {
    let log = ""
    switch (type) {
        case "topup":
            log = await investInPool(poolAddress, amount)
            break
        case "takeout":
            log = await divestFromPool(poolAddress, amount)
            break
        default:
            log = await createPool(null, poolParams['name'], poolParams['symbol'], poolParams['description'], web3.utils.toChecksumAddress(poolParams['hedgingAddress']), amount)
    }
    console.log('trade', log)
    return log
}

export const approveInvestInPool = async (amount) =>{
    try{
        const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
        const brokerAddress = await moretContract.methods.broker().call()
        const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)

        const fundingAddress = await brokerContract.methods.funding().call()
        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)

        var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
        var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
        // console.log(paymentToken, account, exchangeAddress, amount)
        await approveMaxAmount(paymentToken, account, exchangeAddress, amount)
        return 'success'
    }
        catch (err) {
        return 'failure' //err.message
    }
}

// poolAddress is the selected pool contract address
// amount is the USDC amount to invest in pool
export const investInPool = async (poolAddress, amount) => {
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const brokerAddress = await moretContract.methods.broker().call()
    const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const fundingAddress = await brokerContract.methods.funding().call()
    const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)

    const tokenDecimals = await paymentToken.methods.decimals().call()
    const amountInDecimals = web3.utils.toBN(web3.utils.toWei(amount.toFixed(18))).div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(tokenDecimals))))

    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    var gasPriceCurrent = await web3.eth.getGasPrice();
    var gasEstimated = await exchangeContract.methods.addCapital(poolAddress, amountInDecimals).estimateGas({ from: account, gasPrice: gasPriceCurrent });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);

    console.log('add capital', poolAddress, amountInDecimals)
    let approveTradeLink = null
    await exchangeContract.methods.addCapital(poolAddress, amountInDecimals).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
        // console.log(`https://polygonscan.com/tx/${hash}`)
        approveTradeLink = `https://polygonscan.com/tx/${hash}`
    }).on('error', function (error, receipt) {
        return ""
    })
    console.log('link', approveTradeLink)
    return approveTradeLink
}

// 15. divest from a selected pool
// amount is the USDC amount to invest in pool
export const quoteDivestFromPool = async (poolAddress, amount) => {
    // try {
        const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
        const netCapital = await vaultContract.methods.calcCapital(poolAddress, true, true).call()
        const netCapitalFloat = parseFloat(web3.utils.fromWei(netCapital))
        if (netCapitalFloat <= 0) {
            throw 'Net capital to withdraw is zero.'
        }
        const quoteDivest = amount / netCapitalFloat

        const poolContract = await getContract(web3, getJsonUrl("Pool.json"), poolAddress)
        const poolToken = await poolContract.methods.symbol().call()
        const premiumToken = 'USDC'

        return {
            'divest': `${Big(amount).round(5)} ${premiumToken}`,
            'holding': `${Big(quoteDivest).round(5)} ${poolToken}`
        }
    // }
    // catch (err) {
    //     return err.message
    // }
}

// amount is the usdc amount to invest in pool
export const approveDivestFromPool = async (poolAddress, amount) => {
    try{
        const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
        const netCapital = await vaultContract.methods.calcCapital(poolAddress, true, true).call()
        const netCapitalFloat = parseFloat(web3.utils.fromWei(netCapital))
        if (netCapitalFloat <= 0) {
            throw 'Net capital to withdraw is zero.'
        }
        const poolAmount = amount / netCapitalFloat;

        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), poolAddress)
        var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
        var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
        await approveMaxAmount(paymentToken, account, exchangeAddress, poolAmount)
        return 'success'
    }
    catch(err){
        return 'failure' //err.message
    }
}

// poolAddress is the selected pool contract address
// amount is the USDC amount to invest in pool
export const divestFromPool = async (poolAddress, amount) => {
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
    const netCapital = await vaultContract.methods.calcCapital(poolAddress, true, true).call()
    const netCapitalFloat = parseFloat(web3.utils.fromWei(netCapital))
    if (netCapitalFloat<= 0){
        throw 'Net capital to withdraw is zero.'
    }
    const poolAmount = amount / netCapitalFloat;
    console.log('withdraw', poolAmount);
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), poolAddress)
    const tokenDecimals = await paymentToken.methods.decimals().call()
    const amountInDecimals = web3.utils.toBN(web3.utils.toWei(poolAmount.toFixed(18))).div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(tokenDecimals))))

    var gasPriceCurrent = await web3.eth.getGasPrice();
    var gasEstimated = await exchangeContract.methods.withdrawCapital(poolAddress, amountInDecimals).estimateGas({ from: account, gasPrice: gasPriceCurrent });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);

    console.log('withdraw capital', poolAddress, amountInDecimals)
    let approveTradeLink = null
    await exchangeContract.methods.withdrawCapital(poolAddress, amountInDecimals).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
        // console.log(`https://polygonscan.com/tx/${hash}`)
        approveTradeLink = `https://polygonscan.com/tx/${hash}`
    }).on('error', function (error, receipt) {
        return ""
    })
    console.log('link', approveTradeLink)
    return approveTradeLink
}

// 16. add new pools
export const createPool = async (tokenAddr = null, poolName, poolSymbol, marketMakerDescription, botAddress, initialCapital) => {

    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    const marketFactoryContract = await getContract(web3, getJsonUrl("MarketMakerFactory.json"), marketMakerFactoryAddress)
    const poolFactoryContract = await getContract(web3, getJsonUrl("PoolFactory.json"), poolFactoryAddress)
    const poolGovFactoryContract = await getContract(web3, getJsonUrl("PoolGovernorFactory.json"), poolGovFactoryAddress)
    
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const brokerAddress = await moretContract.methods.broker().call()
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    
    let factoryCount = await marketFactoryContract.methods.count().call()
    let salt = web3.utils.keccak256(factoryCount.toString())

    var gasPriceCurrent = await web3.eth.getGasPrice()
    const gasDefault = 1e7
    var nonceNew = await web3.eth.getTransactionCount(account)
    const description = web3.utils.padLeft(web3.utils.asciiToHex(marketMakerDescription), 32)
    console.log(salt, web3.utils.toChecksumAddress(botAddress), objTokenAddr, description)
    await marketFactoryContract.methods.deploy(salt, web3.utils.toChecksumAddress(botAddress), objTokenAddr, description).send({ from: account, gas: gasDefault, gasPrice: gasPriceCurrent, nonce: nonceNew })
    let marketAddress = await marketFactoryContract.methods.computeAddress(salt, web3.utils.toChecksumAddress(botAddress), objTokenAddr, description).call()
    let marketContract = await getContract(web3, getJsonUrl("MarketMaker.json"), marketAddress)
    console.log('new market contract', marketAddress)
    
    gasPriceCurrent = await web3.eth.getGasPrice()
    nonceNew = await web3.eth.getTransactionCount(account)
    await poolFactoryContract.methods.deploy(salt, poolName, poolSymbol, marketAddress, brokerAddress).send({ from: account, gas: gasDefault, gasPrice: gasPriceCurrent, nonce: nonceNew })
    let poolAddress = await poolFactoryContract.methods.computeAddress(salt, poolName, poolSymbol, marketAddress).call()
    let poolContract = await getContract(web3, getJsonUrl("Pool.json"), poolAddress)
    console.log('new pool contract', poolAddress)
    
    gasPriceCurrent = await web3.eth.getGasPrice()
    nonceNew = await web3.eth.getTransactionCount(account)
    await poolGovFactoryContract.methods.deploy(salt, poolAddress).send({ from: account, gas: gasDefault, gasPrice: gasPriceCurrent, nonce: nonceNew })
    // let poolGovBytecode = web3.utils.soliditySha3(Govern.bytecode, web3.eth.abi.encodeParameters(['address'], [poolAddress2]));
    // let poolGovAddress = '0x' + web3.utils.soliditySha3('0xff', poolGovFactoryInstance.address, salt2, poolGovBytecode).substr(26);
    // let poolGovInstance = await Govern.at(poolGovAddress);
    console.log('new pool gov contract')
    
    const fundingAddress = await brokerContract.methods.funding().call()
    const fundingContract = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
    const fundingDecimals = await fundingContract.methods.decimals().call();
    var initialCapitalERC20 = initialCapital * (10 ** (Number(fundingDecimals)));
    initialCapitalERC20 = web3.utils.toBN(initialCapitalERC20.toString());
    gasPriceCurrent = await web3.eth.getGasPrice()
    nonceNew = await web3.eth.getTransactionCount(account)
    let approveTradeLink = null

    await exchangeContract.methods.addCapital(poolAddress, initialCapitalERC20).send({ from: account, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
        // console.log(`https://polygonscan.com/tx/${hash}`)
        approveTradeLink = `https://polygonscan.com/tx/${hash}`
    }).on('error', function (error, receipt) {
        return ""
    })
    console.log('link', approveTradeLink)
    return approveTradeLink
}

// 17. list all savers with their features ( to be done )
export const getAllSavers = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    // const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    // const brokerAddress = await moretContract.methods.broker().call()
    // const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    // var allPools = await brokerContract.methods.getAllPools(objTokenAddr).call()
    // allPools = allPools.filter((el) => !excludedPools.includes(el));
    // return allPools
    return (objTokenAddr in fixedIndexList) ? fixedIndexList[objTokenAddr] : []
}

export const getSaverInfo = async (saverAddress, infoType) => {
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    const saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
    switch (infoType){
        case 'name':
            const name = await saverContract.methods.name().call()
            return name
        case 'symbol':
            const symbol = await saverContract.methods.symbol().call()
            return symbol
        case 'aum':
            let saverPV = await saverContract.methods.getPV().call()
            return `$${(parseFloat(web3.utils.fromWei(saverPV))).toFixed(0)}`
        case 'nav':
            let saverPV2 = await saverContract.methods.getPV().call()
            let totalSupply = await saverContract.methods.totalSupply().call()
            let nav = (parseFloat(web3.utils.fromWei(saverPV2)) / parseFloat(web3.utils.fromWei(totalSupply)))
            return `$${isNaN(nav) ? 0 : nav.toFixed(2)}`
        case 'holding':
            let holding = await saverContract.methods.balanceOf(account).call()
            return parseFloat(web3.utils.fromWei(holding)).toFixed(0)
        case 'description':
            let params = await saverContract.methods.fiaParams().call()
            let paramsMsg = `Soft Ceiling at ${(Number(params.callMoney) / Number(params.multiplier)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })} rolled every ${Number(params.callTenor) / 86400} days <br>Buffer range ${(Number(params.putSpread) / Number(params.multiplier)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })} to ${(Number(params.putMoney) / Number(params.multiplier)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })} rolled every ${Number(params.putTenor) / 86400} days`
            return paramsMsg
        case 'yield':
            let poolAddress = await saverContract.methods.pool().call()
            let vintageYield = 0
            let options = await vaultContract.methods.getHolderOptions(poolAddress, account).call()
            await Promise.all(options.map(async (optionId) => {
                let option = await vaultContract.methods.getOption(optionId).call()
                if (Number(option.side) == 1 && Number(option.poType) == 0){
                    let optionPremium = parseFloat(web3.utils.fromWei(option.premium))
                    vintageYield = vintageYield + optionPremium / Number(option.tenor) * 86400 * 365
                }
            }))
            return vintageYield.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1 })
        case 'vintage':
            const vintage = await saverContract.methods.vintage().call()
            return {
                "StartLevel": parseFloat(web3.utils.fromWei(vintage.startLevel)),
                "Upside": parseFloat(web3.utils.fromWei(vintage.callStrike)),
                "Downside": parseFloat(web3.utils.fromWei(vintage.putStrike)),
                "Protection": parseFloat(web3.utils.fromWei(vintage.putStrike)) - parseFloat(web3.utils.fromWei(vintage.putSpread))
            }
        case 'profit':
            const vintage2 = await saverContract.methods.vintage().call()
            const currentPV = await saverContract.methods.getPV().call()
            let profits = parseFloat(web3.utils.fromWei(vintage2.startLevel)) > 0 ? (parseFloat(web3.utils.fromWei(currentPV)) / parseFloat(web3.utils.fromWei(vintage2.startLevel)) - 1) : 0
            return profits.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1 })
        case 'time':
            let vintageEnds = await saverContract.methods.nextVintageTime().call()
            let vintageParams = await saverContract.methods.fiaParams().call()
            let nextVintageStart = Number(vintageEnds) + Number(vintageParams.tradeWindow)
            return [new Date(vintageEnds * 1000).toLocaleString(), new Date(nextVintageStart * 1000).toLocaleString(), Date(vintageEnds * 1000) < Date.now()]
        default:
            return ''
    }
}

export const getAllSaverInfo = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    let saverTable = []
    console.log('saver load starts')
    const saverList = await getAllSavers(objTokenAddr)

    await Promise.all(saverList.map(async (saverInfo) => {
        if (saverInfo.tokenAddress == objTokenAddr){
            const saverAddress = saverInfo.addresses[0]

            let saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
            // const oracleAddress = await saverContract.methods.oracle().call()
            // const oracle = await getContract(web3, getJsonUrl("VolatilityChain.json"), oracleAddress)
            const fundingContract = await getContract(web3, getJsonUrl("ERC20.json"), stableCoinAddress)

            let blockId = await web3.eth.getBlockNumber()
            const name = await saverContract.methods.name().call(blockId)
            
            let saverPV = await saverContract.methods.getPV().call(blockId)
            // const spotPrice = await oracle.methods.queryPrice().call(blockId)
            const vintage = await saverContract.methods.vintage().call(blockId)

            const fundingDecimals = await fundingContract.methods.decimals().call(blockId)
            // let fundingBalance = await fundingContract.methods.balanceOf(saverAddress).call(blockId)

            
            
            let totalSupply = await saverContract.methods.totalSupply().call(blockId)
            let unitHeld = await saverContract.methods.balanceOf(account).call(blockId)
            let nextVintage = await saverContract.methods.nextVintageTime().call(blockId)
            let params = await saverContract.methods.fiaParams().call(blockId)

            console.log(saverAddress, saverPV)

            

            let totalUnits = parseFloat(web3.utils.fromWei(totalSupply))
            
            let unitPrice = marketCap / totalUnits
            
            let vintagePnL = marketCap / startCap - 1
            console.log(saverAddress, startCap, marketCap, unitPrice, vintagePnL)
            
            let holdings = parseFloat(web3.utils.fromWei(unitHeld)) * unitPrice            
            
            
            let paramsMsg = `Soft Ceiling at ${(Number(params.callMoney) / Number(params.multiplier)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })} rolled every ${Number(params.callTenor) / 86400} days <br>Buffer range ${(Number(params.putSpread) / Number(params.multiplier)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })} to ${(Number(params.putMoney) / Number(params.multiplier)).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })} rolled every ${Number(params.putTenor) / 86400} days`
            
            let nextVintageStart = Number(nextVintage) + Number(params.tradeWindow)
            
        
            // console.log(params, nextVintage, nextVintageStart)

            saverTable.push({
                "Name": name,
                // "Symbol": symbol,
                "Address": saverAddress,
                "MarketCap": `$${(marketCap).toFixed(0)}`,
                "UnitAsset": unitPrice,// `$${(unitPrice).toFixed(2)}`,
                "Holding": `$${(holdings).toFixed(2)}`,
                "UnitHeld": parseFloat(web3.utils.fromWei(unitHeld)).toFixed(1),
                // "Tenor": Math.ceil(vintageTenor / 3600 ), // convert seconds to hours
                // "StaticYield": estyield.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 }),
                "ProfitLoss": vintagePnL.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 }),
                "NextVintageTime": nextVintage,
                "NextVintageStart": new Date(nextVintageStart * 1000).toLocaleString(),
                "NextVintage": new Date(Number(nextVintage) * 1000).toLocaleString(),
                "StartLevel": parseFloat(web3.utils.fromWei(vintage.startLevel)).toFixed(0),
                "Upside": parseFloat(web3.utils.fromWei(vintage.callStrike)).toFixed(0),
                "Downside": parseFloat(web3.utils.fromWei(vintage.putStrike)).toFixed(0),
                "Protection": parseFloat(web3.utils.fromWei(vintage.putSpread)).toFixed(0),
                "Params": paramsMsg,
            })
        
        }
    }))

    return saverTable
}

// 18. invest in a selected saver
// amount is the USDC amount to invest in saver
export const quoteInvestInSaver = async (saverAddress, amount) => {
    try {
        const saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
        const saverToken = await saverContract.methods.symbol().call()
        const premiumToken = 'USDC'

        const unitPrice = await saverContract.methods.getRollsUnitAsset().call()
        const fundingAddress = await saverContract.methods.funding().call()
        const fundingContract = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
        const fundingDecimals = await fundingContract.methods.decimals().call()
        
        const quoteInvest = Number(amount) / (parseFloat(web3.utils.fromWei(unitPrice)) * (10 ** (18 - Number(fundingDecimals))))
        
        return {
            'invest': `${Big(amount).round(5)} ${premiumToken}`,
            'holding': `${Big(quoteInvest).round(5)} ${saverToken}`,
            'funding': Number(amount),
            'units': quoteInvest
        }
    }
    catch (err){
        console.log(err.message)
        return err.message
    }
}


export const approveSaver = async (type, saverAddress, funding, units) => {
    try {
        var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
        var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

        const saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
        console.log(type, saverAddress, funding, units)
        if (type === "save") {
            const fundingAddress = await saverContract.methods.funding().call()
            // console.log('top up', saverAddress, fundingAddress, account, funding, units)
            const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
            await approveMaxAmount(paymentToken, account, saverAddress, funding)
            
            return 'success'
        } else if (type === "withdraw") {
            // console.log('take out', saverAddress, paymentToken, account, funding, units)
            await approveMaxAmount(saverContract, account, saverAddress, units)
            
            return 'success'
        }
        else{
            throw  'Incorrect type for approval.'
        }
        
    }
    catch (err) {
        return 'failure' //err.message
    }
}

export const tradeSaver = async (type, saverAddress, funding, units) => {
    let log = ""
    switch (type) {
        case "topup":
            log = await investInSaver(saverAddress, funding)
            break
        default:
            log = await divestFromSaver(saverAddress, units)
    }
    console.log('trade', log)
    return log
}

// saverAddress is the selected saver contract address
// amount is the USDC amount to invest in saver, in funding decimals
export const investInSaver = async (saverAddress, amount) => {
    const saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
    const fundingAddress = await saverContract.methods.funding().call()
    const fundingContract = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
    const fundingDecimals = await fundingContract.methods.decimals().call()

    const amountInWei = web3.utils.toBN(web3.utils.toWei(amount.toFixed(18))).div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(fundingDecimals))))
    
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
    console.log('invest in saver', saverAddress, amount)

    var gasPriceCurrent = await web3.eth.getGasPrice();
    var gasEstimated = await saverContract.methods.invest(amountInWei).estimateGas({ from: account, gasPrice: gasPriceCurrent });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);

    let approveTradeLink = null
    await saverContract.methods.invest(amountInWei).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
        // console.log(`https://polygonscan.com/tx/${hash}`)
        approveTradeLink = `https://polygonscan.com/tx/${hash}`
    }).on('error', function (error, receipt) {
        return ""
    })
    console.log('link', approveTradeLink)
    return approveTradeLink
}

// 15. divest from a selected pool
// amount is the USDC amount to invest in pool
export const quoteDivestFromSaver = async (saverAddress, amount) => {
    try {
        const saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
        const saverToken = await saverContract.methods.symbol().call()
        const premiumToken = 'USDC'

        const unitPrice = await saverContract.methods.getRollsUnitAsset().call()
        const fundingAddress = await saverContract.methods.funding().call()
        const fundingContract = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
        const fundingDecimals = await fundingContract.methods.decimals().call()

        const quoteDivest = Number(amount) / (parseFloat(web3.utils.fromWei(unitPrice)) * (10 ** (18 - Number(fundingDecimals))))
        
        return {
            'divest': `${Big(amount).round(5)} ${premiumToken}`,
            'holding': `${Big(quoteDivest).round(5)} ${saverToken}`,
            'funding': Number(amount),
            'units': quoteDivest
        }
    }
    catch (err) {
        return err.message
    }
}

// saverAddress is the selected saver contract address
// amount is the FIP units to divest from saver, in 18 decimals
export const divestFromSaver = async (saverAddress, units) => {
    const saverContract = await getContract(web3, getJsonUrl("FixedIndex.json"), saverAddress)
    const saverDecimals = await saverContract.methods.decimals().call()

    const unitsInWei = web3.utils.toBN(web3.utils.toWei(units.toFixed(18))).div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(saverDecimals))))
    console.log('Divest from saver', saverAddress, units)

    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    var gasPriceCurrent = await web3.eth.getGasPrice();
    var gasEstimated = await saverContract.methods.divest(unitsInWei).estimateGas({ from: account, gasPrice: gasPriceCurrent });
    gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
    var nonceNew = await web3.eth.getTransactionCount(account);
    
    let approveTradeLink = null
    await saverContract.methods.divest(unitsInWei).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
        // console.log(`https://polygonscan.com/tx/${hash}`)
        approveTradeLink = `https://polygonscan.com/tx/${hash}`
    }).on('error', function (error, receipt) {
        return ""
    })
    console.log('link', approveTradeLink)
    return approveTradeLink
}