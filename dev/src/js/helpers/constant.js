export const vaultAddress = "0x0E24D8ca6681A41E7d2A0e22482110387524bce0"
export const exchangeAddress = "0x82bc2dA81EbEC639dfeE2D36AC8E82e6E46771d7"
export const moretAddress = "0xC65DeC0720A7A37079b5e3d8EB650446082e2585"


export const marketMakerFactoryAddress = "0xe1FEEaf27bd0d4Aa7BbD40612BaA2Ced41dd64d7"
export const poolFactoryAddress = "0xFD9aef1Ff0229bE8e63824C78FE9fF52477076FC"
export const poolGovFactoryAddress = "0xD158e551EbFd9A9CB9D997C529E7aD386a87b7B3"

export const excludedPools = []

export const poolList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xE15A3a1d19a48c0b1dB46C3F69b9A2F258B56963"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xDf316b15B0d54C3159Be342377E73C8120e23f92"],
    "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7":
        ["0xe39b7E5F04FCD8abde312E5B7a4c49Ed1C686A49"]
}

export const fixedIndexList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x58BDEA020b4b493a3C4c326D3DAe9b5201C8a70B"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x53C3d9Ff402dC7EbF82E20E488889220009347B8"],
    "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7":
        ["0x67312A6ac2fAe67eF5981D8e30aaA5E24E882610"]
}

export const perpList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xbB11C73775F3cF1AF85a4dcA6b12FADF9bE72391","0xbABedEc578Ce3bC131cC63A2fA093b870437Cf8c"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xa722E3F7252EA5961194E5B0c8A2746e77D7ecDe","0xAA9228DFA5E34Da084B6D03df5c56A92566dbebd"],
    "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7":
        ["0x83A2D220132B7f7C07BC4Bd859CA753B04df48aC","0x84b308D1a137Bb01edF59fA0B07434f1Fe5680D4"]
}


export const maxAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

export const tokenActive = "tokenActive"

export const expirationDays = [0.5, 1, 7, 30]

export const tokenName = () => JSON.parse(localStorage.getItem(tokenActive)).token

export const tokenPrice = () => JSON.parse(localStorage.getItem(tokenActive)).price

export const tokenAddress = () => JSON.parse(localStorage.getItem(tokenActive)).address

export const tokens = [
    { token: "ETH", price: "USD", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" },
    { token: "BTC", price: "USD", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6" },
    // { token: "MATIC", price: "USD", address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" },
    { token: "GHST", price: "USD", address: "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7" }
]

export const stableCoinAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"

