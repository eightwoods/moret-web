export const moretAddress = "0x67496507CC6Ef70E277c5226829C7A9078A59Cad"

export const exchangeAddress = "0x1e8719b9467B02e2010f7E90A35A82251EFD5565"

export const vaultAddress = "0xE581929cA0F6Afab463B087d8CCce365D049fE72"

export const marketMakerFactoryAddress = "0xAdAD0E0e66fB4c3ae25b36bBB75c8d888355266D"

export const poolFactoryAddress = "0x00e1579bcB979CaF2c910f8Be62a797a3aF223A2"

export const poolGovFactoryAddress = "0x6a2ce9D48cEf1F30FBe9a24e36E8E4aF0f23F15C"

export const excludedPools = []

export const poolList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0xbAf96cD6C1C6f7b01A3cb1661A6FcD524905Df3B"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x6918857A4231D0D8D29561E89672D5ea57086b06"]
}

export const fixedIndexList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x0ee488BEAFe100f115293ab5E1f2791FF4cBec3a"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0xF460A60615B794b11E8b4CD641C1d35d19d2c46D"]
}

export const perpList = {
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": ["0x84a1d58CA75677A8d67e49FDCE5EF22d16aecf00", "0xF300735D32FEe03b4f1b86C5849b9d7382661480"],
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": ["0x1d3DE0E6B58706ab791E2F6F4cF7819bD0591FD4", "0x7daC04B413C2438FF98dc17BA22F684cd186B9a8"]
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
