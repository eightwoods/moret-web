export const moretAddress = "0x386322f0a82d8F82958e6a78AF1Ee6b0Dcc5bAaB"

export const exchangeAddress = "0x65d3bF1E994a76Dd512039EF3dF1d111f7B07f4f"

export const tokenActive = "tokenActive"

export const tokenName = () => JSON.parse(localStorage.getItem(tokenActive)).token

export const tokenPrice = () => JSON.parse(localStorage.getItem(tokenActive)).price

export const tokenAddress = () => JSON.parse(localStorage.getItem(tokenActive)).address

export const tokens = [
    {token: "ETH", price: "USD", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"},
    {token: "BTC", price: "USD", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"}
]