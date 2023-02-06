export const moretAddress = "0xA326Fa1B2DBdB20233B4c96fdD6057E4d4cA17Ed"

export const exchangeAddress = "0x39b6C27a35Dfd17d968b60E7555f51a7a06DEEd0"

export const vaultAddress = "0x6218fe5B3cf8524d5860b8AaAF9077C2d726833A"

export const marketMakerFactoryAddress = "0x2c484aAD20A4c663D109D7166F4C7B3Ee7A36F7A"

export const poolFactoryAddress = "0x76911e0833715aCe7a38055605d5c57847C611c6"

export const poolGovFactoryAddress = "0x6B59134A21d0153c55B8C61B05933c591DaF41dE"

export const excludedPools = []

export const poolList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xadb51F214f847E397175d7217BB807B8fD0E457D"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x4c758A9F5aC5E7fDe99Ee6536901c5940aAD623C"]
}

export const fixedIndexList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xd327Aee5cb3CD9B8D1e214ceaa02bd51021A7586"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xC4c871555C013e56405F88E70c1Ca2774a2ce689"]
}

export const perpList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xD1E718AF4E5cB4FA73c49cD2fcb41353C86060D9", "0x4cA6410a6ec4d7205739F387Bb777EE51ac9B9C3"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x94138C3c8726480B9396A1aFa54c69B5F9BCeF2a", "0xD41C7c7dd8D570d12600d110E9E4dc09Cdd1E59C"]
}


export const maxAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

export const tokenActive = "tokenActive"

export const expirationDays = [1, 7, 30]

export const tokenName = () => JSON.parse(localStorage.getItem(tokenActive)).token

export const tokenPrice = () => JSON.parse(localStorage.getItem(tokenActive)).price

export const tokenAddress = () => JSON.parse(localStorage.getItem(tokenActive)).address

export const tokens = [
    {token: "ETH", price: "USD", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"},
    {token: "BTC", price: "USD", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"}
]

export const stableCoinAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
