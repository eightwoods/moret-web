export const moretAddress = "0x38D0C2B061E129c861F66f07eB1Bea5E51f49e62"

export const exchangeAddress = "0xD23F204bac794034f15f81543686363a2c488b43"

export const vaultAddress = "0x797E9957Bf4473A0965eC6b11cAA50dd0cd898fc"

export const marketMakerFactoryAddress = "0x062e4595C3D86AC689eEE4809f12c49EB2FF5878"

export const poolFactoryAddress = "0xBD64Fff5387C5599816417D1ec33D7F5EedA458c"

export const poolGovFactoryAddress = "0xc9f3E46C28673D19D8C82F9cA9E898AB856409cB"

export const excludedPools = []

export const poolList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x82e1da20966676d731f4b1c9EafD307b3c4CD741"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x7263902e3c147b8F330C5b95F824134414389cfc"]
}

export const fixedIndexList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x2ab0e320Fb9855750bE8409a29746647a20CEd7D"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xaB03F44f7bdb4f6839e75194791f7A4BD39921fD"]
}

export const perpList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x153B1e88950369623965edD02797B6d3880B5524", "0xDBA53eF38Fa377cf5C3156347fA3c4521c1F2114"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x31dA4d4930054fE759e72E2D9eC616213Ddd7A2D", "0xC7d13827d114898E80a99e7f09eEAe74F0DECa13"]
}


export const maxAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

export const tokenActive = "tokenActive"

export const expirationDays = [1, 7, 30]

export const tokenName = () => JSON.parse(localStorage.getItem(tokenActive)).token

export const tokenPrice = () => JSON.parse(localStorage.getItem(tokenActive)).price

export const tokenAddress = () => JSON.parse(localStorage.getItem(tokenActive)).address

export const tokens = [
    { token: "ETH", price: "USD", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" },
    { token: "BTC", price: "USD", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6" }
]

export const stableCoinAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"

