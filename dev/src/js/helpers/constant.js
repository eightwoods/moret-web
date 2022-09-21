export const moretAddress = "0xD294BF485222f50c76591751B69d7A188499B145"

export const exchangeAddress = "0x117E34f9180696EE310fcF70858de3598F706d6b"

export const marketMakerFactoryAddress = "0xe76452511bd847379Af2328A15BAC45d684203Cb"

export const poolFactoryAddress = "0x26a6d08B4CE66F7245bb7e4Fab02f4708a5d927D"

export const poolGovFactoryAddress = "0x13df1f30f8EE5C8df0Df9E096e728AE86f8613F5"

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