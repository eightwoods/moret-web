export const moretAddress = "0x8C0d01029203A7e4B3f497667C45dFf13d3eB4Dc"

export const exchangeAddress = "0x890428f554D69e9a3693a957c576205F35A1553B"

export const vaultAddress = "0xC4fCAc3609cbC0b44Fd65582932006a52e0C2fcf"

export const marketMakerFactoryAddress = "0xF70f0B044C4a725Ce5A441e3d0A00299732898C2"

export const poolFactoryAddress = "0xfAB4cDF5670443B912e6322A367ccAc177edecd7"

export const poolGovFactoryAddress = "0x8F0e31BC60aFf2E1EfeC97FccCCbdbF02C28c2fe"

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

export const excludedPools = []

export const poolList = { 
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xB3efee6B983e5815AfC4a497E81150F57Fe319bb"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xcd2df8b88CF2e0af3c62C9723ca9C9392467Bb13", "0xcd2df8b88CF2e0af3c62C9723ca9C9392467Bb13"] 
}

export const fixedIndexList = { 
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xCC1988a477A2d94b89F396122C8760168E98ca26"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xeC3aa74900ff2c6428eCB9bb2B9Ae70D31329C1E"]
}

export const perpList = [
    { tokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", addresses: ["0x3E9143070fAD24F694EbD6b2243b7fAE58be3e41"] },
    { tokenAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", addresses: ["0x67b5d1723F83576B19CFBA032f030E2B9713d142"] }
]