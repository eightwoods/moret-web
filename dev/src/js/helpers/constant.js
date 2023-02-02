export const moretAddress = "0xb781291222a1c35ACF39f886260951728ab49a40"

export const exchangeAddress = "0x6d08ea1ceeB4B4E0270B08FE5dfbD741df410da1"

export const vaultAddress = "0x5906595607143650E3e905cf80b97e7029A3Da28"

export const marketMakerFactoryAddress = "0xF7Aac55AD1267096A4f53B81dbE55469F8724478"

export const poolFactoryAddress = "0x3669DA883027e4099093E10B123a7a506d47afb3"

export const poolGovFactoryAddress = "0x3a18D72918cde10aDe74E96591A43145eA2Db113"

export const excludedPools = []

export const poolList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x33B53299bC6C5D3433AeF84397A1B82e6F7c7E81"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xfBa0168dD9345373E2d391Efd4d83A6322254b87"]
}

export const fixedIndexList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x5ec0A85f13ee1E4ee3bd3aaeDca69B1Be82A0bfb"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x203AE59E02769F591F2C11F114Ad038A3f842324"]
}

export const perpList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x1548aAD9C04Af521edDF964B6ed763b2e701DeA2", "0x0aCD8d2151ff2ae16c3efe68633c9b3231183872"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xcfCaeF892e9C7fCcd3E4BF38d9329ed157ab7b49", "0x4f0a9C51F70e93C6B2374a145FEAd8B8F11A0e8F"]
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
