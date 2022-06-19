import Big from "big.js"

export const web3 = new Web3(window.ethereum)

export const getContract = async (web3, path, address) => {
    const response = await fetch(path)
    const data = await response.json()

    return new web3.eth.Contract(data.abi, address)
}

export const getPrice = async (tokenAddress) => {
    const jsonUrlMoret = new URL("/src/json/Moret.json", import.meta.url)
    const jsonUrlVolatilityChain = new URL("/src/json/VolatilityChain.json", import.meta.url)

    const moretContract = await getContract(web3, jsonUrlMoret, "0x8f529633a6736E348a4F97E8E050C3EEd78C3C0a")
    const oracleAddress = await moretContract.methods.getVolatilityChain(String(tokenAddress)).call()
    const oracle = await getContract(web3, jsonUrlVolatilityChain, oracleAddress)
    const tokenPrice = await oracle.methods.queryPrice().call()

    return `$${Big(web3.utils.fromWei(tokenPrice)).round(2).toNumber()}`
}