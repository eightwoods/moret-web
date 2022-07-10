import Big from "big.js"
import { moretAddress, exchangeAddress, maxAmount, tokenAddress } from "./constant"
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
    const expirationDays = [1, 7, 30]
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
// isCall is true if Call is selected, false if Put is selected
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// amount is in float
// expiry is in number of days
// outputReceipt is true if the output is used in receipt popup; it is false if the output is used on trading page
export const calcOptionPrice = async(tokenAddr = null, token = null, isBuy, isCall, paymentMethod, strike, amount, expiry) => {
    try {
        const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        const tenor = Math.floor(expiry * 86400)
        const allPools = await getAllPools(objTokenAddr)
        var bestPool = (0).toString(16)
        var premium, collateral
        var vol = 0
        var price = 0

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
                "premium": `${Big(premium).round(5)}${premiumToken}`,
                "collateral": `${Big(collateral).round(2)}${collateralToken}`
            }
        } else {
            return {
                "volatility": vol,
                "premium": premium,
                "collateral": collateral,
                "pool": bestPool
            }
        }
    } catch(err) {
        return err.message
    }    
}

export const getAllPools = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const brokerAddress = await moretContract.methods.broker().call()
    const brokerContract = await getContract(web3, getJsonUrl("MoretBroker.json"), brokerAddress)
    const allPools = await brokerContract.methods.getAllPools(objTokenAddr).call()
    return allPools
}

// 7. refresh total gross capital and utility in decimals
export const getCapital = async (tokenAddr = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    const vaultAddress = await exchangeContract.methods.vault().call()
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
    }
    const utilization = Math.max(0, 1 - netCapitalTotal / grossCapitalTotal)
    // return [`$${(grossCapitalTotal / 1000)}K`, utilization.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 }) + " of the liquidity pools utilized" ]
    return {
        "gross": `$${(grossCapitalTotal / 1000)}K`,
        "perc": utilization.toLocaleString(undefined, {style: "percent", minimumFractionDigits: 0})
    }
}

// 8a. function to approve max amount if needed
// isBuy is true if Buy is selected, otherwise false
// isCall is true if Call is selected, false if Put is selected
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// amount is in float
// expiry is in number of days
export const approveOptionSpending = async (tokenAddr = null, isBuy, isCall, paymentMethod, strike, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const optionCost = await calcOptionPrice(objTokenAddr, null, isBuy, isCall, paymentMethod, strike, amount, expiry)
    console.log(optionCost)
    const fundingAddress = await moretContract.methods.funding().call()
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
        await approveMaxAmount(collateralToken, account, exchangeAddress, optionCost['collateral'])
    }
    catch (err) {
        console.warn(err)
        return "failure"
    }
}

export const approveMaxAmount = async (erc20Token, account, spenderAddress, spendAmount) => {
    var approvedAmount = await erc20Token.methods.allowance(account, spenderAddress).call()
    const tokenDecimals = await erc20Token.methods.decimals().call()
    const spendAmountInWei = web3.utils.toBN(web3.utils.toWei(spendAmount.toString())).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18 - Number(tokenDecimals))))
    // console.log(approvedAmount, spendAmount, spendAmountInWei);
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
// isCall is true if Call is selected, false if Put is selected
// paymentMethod is 0 if USDC is selected, 1 if ETH/BTC, 2 if volatility token (such as ETH1)
// strike is in integer
// amount is in float
// expiry is in number of days
export const executeOptionTrade = async (tokenAddr = null, isBuy, isCall, paymentMethod, strike, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const optionCost = await calcOptionPrice(objTokenAddr, null, isBuy, isCall, paymentMethod, strike, amount, expiry)
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
            web3.utils.toWei(amount.toString()), 
            isCall ? 0 : 1, 
            isBuy ? 0 : 1, 
            paymentMethod).estimateGas({ from: account, gasPrice: gasPriceCurrent }
        )
        gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))))
        var nonceNew = await web3.eth.getTransactionCount(account)

        let approveTradeLink = null
        await exchangeContract.methods.tradeOption(poolAddress, tenor, web3.utils.toWei(strike.toString()), web3.utils.toWei(amount.toString()), isCall ? 0 : 1, isBuy ? 0 : 1, paymentMethod).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
            // console.log(`https://polygonscan.com/tx/${hash}`)
            // return `https://polygonscan.com/tx/${hash}`
            approveTradeLink = `https://polygonscan.com/tx/${hash}`
        })

        return approveTradeLink
    }
    catch (err) {
        console.warn(err)
    }
}

// 9. read historical transactions: fromBlockNumber is integer of starting block number, can be zero
export const getPastTransactions = async (tokenAddr = null, blockRange = 9000, endBlock = null) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
    const vaultAddress = await exchangeContract.methods.vault().call()
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
        // console.log('events', events)
        // for (let i = 0; i < events.length; i++) {
        //     const optionId = events[i].returnValues._optionId
        //     const option = await vaultContract.methods.getOption(optionId).call()
        //     const optionStrike = parseFloat(web3.utils.fromWei(option.strike))
        //     const optionAmount = parseFloat(web3.utils.fromWei(option.amount))
        //     const secondsToExpiry = Math.floor((option.maturity * 1000 - Date.now()) / 1000)
        //     const timeToExpiry = secondsToExpiry / (3600 * 24 * 365)
        //     // console.log(i, secondsToExpiry, timeToExpiry)
        //     const impliedVol = secondsToExpiry <= 0 ? 0 : await oracle.methods.queryVol(secondsToExpiry).call() 
        //     const optionData = {}
        //     optionData["Type"] = option.poType == 0 ? "Call" : "Put"
        //     optionData["B/S"] = option.side == 0 ? "Buy" : "Sell"
        //     optionData["Expiry"] = new Date(option.maturity * 1000).toLocaleString()
        //     optionData["Strike"] = optionStrike.toFixed(2)
        //     optionData["Amount"] = optionAmount.toFixed(2)
        //     optionData["Delta"] = timeToExpiry <= 0 ? 0 : getDelta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0? 1: -1)
        //     optionData["Gamma"] = timeToExpiry <= 0 ? 0 : getGamma(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1)
        //     optionData["Vega"] = timeToExpiry <= 0 ? 0 : getVega(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1)
        //     optionData["Theta"] = timeToExpiry <= 0 ? 0 : getTheta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0 ? 1 : -1)
        //     // console.log(optionData)
        //     optionTable.push(optionData)
        // }
    })
    
    // best approach illiterate array value and for iteration
    let optionTable = []
    for (let i = 0; i < resEvents.length; i++) {
        const optionId = resEvents[i].returnValues._optionId
        const option = await vaultContract.methods.getOption(optionId).call()
        const optionStrike = parseFloat(web3.utils.fromWei(option.strike))
        const optionAmount = parseFloat(web3.utils.fromWei(option.amount))
        const secondsToExpiry = Math.floor((option.maturity * 1000 - Date.now()) / 1000)
        const timeToExpiry = secondsToExpiry / (3600 * 24 * 365)
        const impliedVol = secondsToExpiry <= 0 ? 0 : await oracle.methods.queryVol(secondsToExpiry).call()
        // console.log(i, secondsToExpiry, timeToExpiry)
        optionTable.push({
            "Type": option.poType == 0 ? "Call" : "Put",
            "BS": option.side == 0 ? "Buy" : "Sell",
            "Expiry": new Date(option.maturity * 1000).toLocaleString(),
            "Strike": optionStrike.toFixed(0),
            "Amount": optionAmount.toFixed(3),
            "Delta": (timeToExpiry <= 0 ? 0 : getDelta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0 ? 1 : -1)).toFixed(3),
            "Gamma": (timeToExpiry <= 0 ? 0 : getGamma(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1)).toFixed(3),
            "Vega": (timeToExpiry <= 0 ? 0 : getVega(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0) * (option.side == 0 ? 1 : -1)).toFixed(3),
            "Theta": (timeToExpiry <= 0 ? 0 : getTheta(tokenPriceNumber, optionStrike, timeToExpiry, parseFloat(web3.utils.fromWei(impliedVol)) / Math.sqrt(timeToExpiry), 0, option.poType == 0 ? 'call' : 'put') * (option.side == 0 ? 1 : -1)).toFixed(3),
        })
    }
    // console.log(optionTable)
    return optionTable
}

// 10. ???
//

// 11. quote vol prices depending on parameters:
// isBuy is true if Buy is selected, otherwise false
// amount is in float number of USDC if isBuy is true, it is number of vol token if isBuy is false
// expiry is in number of days
// return 1) amount of vol token if isBuy is true, or amount of USDC if is Buy is false, and 2) the pool address for best pricing
export const calcVolTokenPrice = async (tokenAddr = null, token = null, isBuy, amount, expiry) => {
    try{
        const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)

        const oracle = await getPriceOracle(tokenAddress)
        const tenor = Math.floor(expiry * 86400)
        const oracleVol = await oracle.methods.queryVol(tenor).call()
        const oraclePrice = await oracle.methods.queryPrice().call()
        const estimatedOptionAmount = (isBuy ? (amount / parseFloat(web3.utils.fromWei(oracleVol))) : amount) / parseFloat(web3.utils.fromWei(oraclePrice)) / Math.sqrt(timeToExpiry) / 0.4

        const allPools = await getVolTradingPools(objTokenAddr)
        var returnAmount, notional
        var vol = 0

        const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
        const volTokenAddress = await moretContract.methods.getVolatilityToken(objTokenAddr, tenor).call()
        const volTokenContract = await getContract(web3, getJsonUrl("VolatilityToken.json"), volTokenAddress)
        const volToken = await volTokenContract.methods.symbol().call()
        const premiumToken = "USDC"

        const timeToExpiry = expiry / 365
        var bestPool = (0).toString(16)

        if (allPools.length==0){
            throw 'There is no available pool to trade volatility tokens with.'
        }

        for (let i = 0; i < allPools.length; i++) {
            const poolAddress = allPools[i]
            const quotedPrice = await exchangeContract.methods.queryOption(poolAddress, tenor, oraclePrice, web3.utils.toWei(estimatedOptionAmount.toString(), 'ether'), 0, isBuy ? 0 : 1, true).call()
            const quotedPremium = parseFloat(web3.utils.fromWei(web3.utils.toBN(quotedPrice[0])))
            const quotedVolatility = parseFloat(web3.utils.fromWei(quotedPrice[3]))
            const optionAmount = (isBuy? quotedPremium: (quotedPremium / quotedVolatility)) / amount * estimatedOptionAmount
            const forAmount = isBuy? (amount / quotedVolatility): (amount * quotedVolatility)

            if (parseInt(bestPool, 16) == 0) {
                returnAmount = forAmount
                bestPool = poolAddress
                vol = quotedVolatility
                notional = optionAmount
            }
            else if (returnAmount < forAmount) {
                returnAmount = forAmount
                bestPool = poolAddress
                vol = quotedVolatility
                notional = optionAmount
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
                "premium": `${Big(isBuy ? amount : returnAmount).round(5)}${premiumToken}`,
                "volpremium": `${Big(isBuy ? returnAmount : amount).round(5)}${volToken}`
            }
        } else {
            return {
                "volatility": vol,
                "premium": isBuy ? amount : returnAmount,
                "volpremium": isBuy ? returnAmount : amount,
                "notional": notional,
                "voltoken": volTokenAddress,
                "pool": bestPool
            }
        }
    
    }
    catch(err){
        return err.message
    }
}

export const getVolTradingPools = async (tokenAddress) => {
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
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

// 12a. function to approve max amount if needed
// isBuy is true if Buy is selected, otherwise false
// amount is in float
// expiry is in number of days
export const approveVolatilitySpending = async (tokenAddr = null, isBuy, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
    const volatilityCost = await calcVolTokenPrice(objTokenAddr, null, isBuy, amount, expiry)
    console.log(volatilityCost)
    var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
    var account = web3.utils.toChecksumAddress(accountsOnEnable[0])

    if(isBuy){
        const fundingAddress = await moretContract.methods.funding().call()
        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)
        await approveMaxAmount(paymentToken, account, exchangeAddress, optionCost['premium'])
    }
    else{
        const volTokenAddress = web3.utils.toChecksumAddress(volatilityCost['voltoken'])
        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), volTokenAddress)
        await approveMaxAmount(paymentToken, account, exchangeAddress, optionCost['volpremium'])
    }
}

// 12b. trade vol tokens 
// isBuy is true if Buy is selected, otherwise false
// amount is in float
// expiry is in number of days
export const executeVolatilityTrade = async (tokenAddr = null, isBuy, amount, expiry) => {
    const objTokenAddr = tokenAddr ? tokenAddr : tokenAddress()
    const volatilityCost = await calcVolTokenPrice(objTokenAddr, null, isBuy, amount, expiry)
    const poolAddress = web3.utils.toChecksumAddress(volatilityCost['pool'])
    const optionNotional = web3.utils.toWei(volatilityCost['notional'].toString())
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
    })
}

// 13. list all pools with their features ( to be done )
//


// 14. invest in a selected pool
// amount is the USDC amount to invest in pool
export const quoteInvestInPool = async (poolAddress, amount) => {
    try {
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        const vaultAddress = await exchangeContract.methods.vault().call()
        const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
        const grossCapital = await vaultContract.methods.calcCapital(poolAddress, false, true).call()
        const grossCapitalFloat = parseFloat(web3.utils.fromWei(grossCapital))
        const quoteInvest = grossCapitalFloat > 0 ? (amount / grossCapitalFloat): amount

        const poolContract = await getContract(web3, getJsonUrl("Pool.json"), poolAddress)
        const poolToken = await poolContract.methods.symbol().call()
        const premiumToken = 'USDC'

        return {
            'invest': `${Big(amount).round(5)}${premiumToken}`,
            'holding': `${Big(quoteInvest).round(5)}${poolToken}`
        }
    }
    catch (err) {
        return err.message
    }
}

// amount is the USDC amount to invest in pool
export const approveInvestInPool = async (amount) =>{
    try{
        const moretContract = await getContract(web3, getJsonUrl("Moret.json"), moretAddress)
        const fundingAddress = await moretContract.methods.funding().call()
        const paymentToken = await getContract(web3, getJsonUrl("ERC20.json"), fundingAddress)

        var accountsOnEnable = await ethereum.request({ method: 'eth_requestAccounts' })
        var account = web3.utils.toChecksumAddress(accountsOnEnable[0])
        await approveMaxAmount(paymentToken, account, exchangeAddress, amount)
        return 'success'
    }
        catch (err) {
        return err.message
    }
}

// poolAddress is the selected pool contract address
// amount is the USDC amount to invest in pool
export const investInPool = async (poolAddress, amount) => {
    try{
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        
        var gasPriceCurrent = await web3.eth.getGasPrice();
        var gasEstimated = await exchangeContract.methods.addCapital(poolAddress, amount).estimateGas({ from: account, gasPrice: gasPriceCurrent });
        gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
        var nonceNew = await web3.eth.getTransactionCount(account);
        await exchangeContract.methods.addCapital(poolAddress, amount).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
            console.log(`https://polygonscan.com/tx/${hash}`)
            return `https://polygonscan.com/tx/${hash}`
        })
    }
    catch(err){
        return err.message
    }
}

// 15. divest from a selected pool
// amount is the USDC amount to invest in pool
export const quoteDivestFromPool = async (poolAddress, amount) => {
    try {
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        const vaultAddress = await exchangeContract.methods.vault().call()
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
            'divest': `${Big(amount).round(5)}${premiumToken}`,
            'holding': `${Big(quoteDivest).round(5)}${poolToken}`
        }
    }
    catch (err) {
        return err.message
    }
}

// amount is the usdc amount to invest in pool
export const approveDivestFromPool = async (poolAddress, amount) => {
    try{
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        const vaultAddress = await exchangeContract.methods.vault().call()
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
        return err.message
    }
}

// poolAddress is the selected pool contract address
// amount is the USDC amount to invest in pool
export const divestFromPool = async (poolAddress, amount) => {
    try{
        const exchangeContract = await getContract(web3, getJsonUrl("Exchange.json"), exchangeAddress)
        const vaultAddress = await exchangeContract.methods.vault().call()
        const vaultContract = await getContract(web3, getJsonUrl("OptionVault.json"), vaultAddress)
        const netCapital = await vaultContract.methods.calcCapital(poolAddress, true, true).call()
        const netCapitalFloat = parseFloat(web3.utils.fromWei(netCapital))
        if (netCapitalFloat<= 0){
            throw 'Net capital to withdraw is zero.'
        }
        const poolAmount = amount / netCapitalFloat;

        var gasPriceCurrent = await web3.eth.getGasPrice();
        var gasEstimated = await exchangeContract.methods.withdrawCapital(poolAddress, poolAmount).estimateGas({ from: account, gasPrice: gasPriceCurrent });
        gasEstimated = Number(web3.utils.toBN(gasEstimated).mul(web3.utils.toBN(Number(150))).div(web3.utils.toBN(Number(100))));
        var nonceNew = await web3.eth.getTransactionCount(account);
        await exchangeContract.methods.withdrawCapital(poolAddress, poolAmount).send({ from: account, gas: gasEstimated, gasPrice: gasPriceCurrent, nonce: nonceNew }).on('transactionHash', (hash) => {
            console.log(`https://polygonscan.com/tx/${hash}`)
            return `https://polygonscan.com/tx/${hash}`
        })
    }
    catch (err) {
        return err.message
    }
}

// 17. governance functions
