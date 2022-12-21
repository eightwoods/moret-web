export const moretAddress = "0x4D2E4e85fbDFBfbE04049251d375e3Faf574C0B0"

export const exchangeAddress = "0xDAF3ebE73D1bcEAFFDc14f4f75F474bD71c86A3D"

export const vaultAddress = "0xd7be9909095292e58b5D39fDfE5A76C9D81AAc32"

export const marketMakerFactoryAddress = "0xd772E7fFDb924BA8998D8b64De76D3212605267F"

export const poolFactoryAddress = "0xfEeC891BECAe9a497Ffefc4dAb477511205F821d"

export const poolGovFactoryAddress = "0xc1CD2084Da3532C4c097AC9Ff69D99faf1df2e22"

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

export const excludedPools = ['0xE896ad64c88042F4f397DE14f3B034957969616C','0x3558246DD5A1E77e9CC11780Cd4523E35209436d']

export const saverList = ['0x4C8fc813D2cc1b2F8977126744f6e7121D8977b5','0x16b3C53827C5a25cb2BD578DDdCB30f34E2C699a']