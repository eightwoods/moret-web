export const moretAddress = "0xb12AA22d4b0749a72A1438C6794d2e723CE576d8"

export const exchangeAddress = "0x63464F921ae0DaEEc9F1ce5E63159558770D5E43"

export const marketMakerFactoryAddress = "0x49211F2B63368dD3D7f4dB39045A1f59f5449C1a"

export const poolFactoryAddress = "0x41D17CBf094D6138217B900887D6B171815dFCFB"

export const poolGovFactoryAddress = "0xFDb491afAa6F26334914e67b8C587f48524D8259"

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
    "0x3655f72B0e8CdAB2A42bB4F42A47f1D026243051",
    "0x18eC2Ee6C147168924D8a2EFD5266AA21D144D9e",
    "0x194d6a8A0829923f78fe0e08BDaeE5a435A6f263",
    "0x0c98c097bD18E0DCC013a0F946f1497bBcc5cdEa",
    "0xa1cE1d7046c19dff228D50B2B44656656FE1ce79"
]