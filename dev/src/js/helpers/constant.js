export const moretAddress = "0x93cD37c93Add316fA7fc15e0cbCee07aFEAE03C5"

export const exchangeAddress = "0x5750c089c25C7Fa7B4e09Be1d62B5a93445859de"

export const marketMakerFactoryAddress = "0x80C3d176Ab39e4b835d097369FA88a0d927b8186"

export const poolFactoryAddress = "0x4384859507F6170e27095e8ED70A14425E61C753"

export const poolGovFactoryAddress = "0x4384859507F6170e27095e8ED70A14425E61C753"

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

export const excludedPools = [
]

export const saverList = ['0xE15d1bb26425a1cA7C215178F134945F38Df1e89','0x487dfEBaa059dbfD133e55DcDCcBf64F0A9d0716']