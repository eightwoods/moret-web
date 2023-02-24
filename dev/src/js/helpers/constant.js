export const moretAddress = "0x43F2acbaE09272021AFC107180Aa0ee313B00D8F"

export const exchangeAddress = "0x335314D1B1671FA1F213e02384303a1871A6b246"

export const vaultAddress = "0xb83090E5EC4Eab41702876eBAC20F0EBEf4203B5"

export const marketMakerFactoryAddress = "0x756eb3bA6D71de4492522dEF0762482a2126E60D"

export const poolFactoryAddress = "0x065e46b06598567a07352C32CBA44Ff91fcf8E4C"

export const poolGovFactoryAddress = "0x83CD87044103386fd9862270Aa4EC8754d1775A9"

export const excludedPools = []

export const poolList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x56Efa213177Fdb6a60Ff8a5e24E164cF6abd4120"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xD352Cc138CD3034723ACDc0cd07810FdedA447C5"]
}

export const fixedIndexList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x56e89176110422d002A39f00aB08FECC3B645271"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x008eF9aa624F2B31fF90ED311A0349Bf71273ceD"]
}

export const perpList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x5241ECBbA82c5154fF39F5BfAd267294B509c7a1", "0x8A8095633DA7273802Ef13B83fEEd2f9b7b3038A"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x716dD4e7E2848c53C6f379A5285dDF0172BbF4a7", "0x3cb40E9e6d0adbE5699EEEa50f970095406BdC36"]
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
