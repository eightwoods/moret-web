export const moretAddress = "0x4D2E4e85fbDFBfbE04049251d375e3Faf574C0B0"

export const exchangeAddress = "0xDAF3ebE73D1bcEAFFDc14f4f75F474bD71c86A3D"

export const marketMakerFactoryAddress = "0x13905A5195B0DE30cCFf9675285CD7bd5b2F9ee3"

export const poolFactoryAddress = "0xA498FE29Ab2Fb6351428d85980D2A653e0489489"

export const poolGovFactoryAddress = "0xC5599d6cc178C74349d8168eE48F40717050a79C"

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

export const saverList = ['0x2285ac4A9f53aD5aC0e36CC727a5a5E5641f6296', '0x8822c9079359bb1301Ef32Eb29289Da3F25C597b','0xcfbF80A089A65e3D45C6DCe5c1B1a2377CdF8D1b']