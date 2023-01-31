import { gsap } from "gsap"
import { minimizeAddress, createList, showOverlayPopup, closeOverlayPopup } from "../helpers/utils"
import { web3 } from "../helpers/web3"

export default {
    init() {
        this.accountsConnect()
        this.accountsChanged()
        this.chainChanged()
        this.isPolygonNetwork()
    },

    async connectMetaMask(button) {
        button.textContent = "Requesting..."

        try {
            await window.ethereum.request({method: "eth_requestAccounts"})
            .then((result) => {
                // console.log("result", result)
                // success
                closeOverlayPopup()
                this.accountsConnect()
            })
            .catch((error) => {
                console.log("eth_requestAccounts error", error)
                throw error
            })
        } catch (error) {
            console.log("error", error)
        }
    },

    accountsConnect() {
        window.ethereum.request({method: "eth_accounts"})
        .then((accounts) => {
            const connectionButton = document.querySelector(".connection-button")
            if (connectionButton) {
                if (accounts.length > 0) {
                    // console.log("current account", accounts)
                    connectionButton.textContent = ""

                    const account = document.createElement("div")
                    account.className = "in-border white-50 icon icon-account active-account"
                    account.textContent = `${minimizeAddress(accounts)}`
                    connectionButton.appendChild(account)
                    
                } else {
                    // console.log("Please connect to MetaMask!")
                    const buttonContainer = document.createElement("div")
                    buttonContainer.className = "button"
                    connectionButton.appendChild(buttonContainer)

                    const button = document.createElement("a")
                    button.setAttribute("href", "#")
                    button.className = "btn btn-blue js-connectWallet"
                    button.textContent = "Connect wallet"
                    buttonContainer.appendChild(button)
                    
                    button.addEventListener("click", (e) => {
                        e.preventDefault()
                        const arrNames = [{name: "Metamask"}, {name: "Walletconnect"}, {name: "Coinbase"}]
                        showOverlayPopup("Connect Wallet", createList(arrNames, "connectwallets"))
                        // events
                        const btnItems = document.querySelectorAll(".overlay-popup .connectwallets li")
                        btnItems.forEach((btn) => {
                            btn.addEventListener("click", (e) => {
                                switch (e.target.className) {
                                    case "metamask":
                                        this.connectMetaMask(btn)
                                        break;
                                    case "walletconnect": break;
                                    case "coinbase": break;
                                    default:
                                }
                            }, false)
                        })
                    }, false)
                }
            }
        })
        .catch((error)=>{
            console.log("eth_accounts error", error)
            throw error
        })
    },

    accountsChanged() {
        // detect Metamask account change
        window.ethereum.on("accountsChanged", (accounts) => {
            // console.log("accountsChanged", accounts)
            this.isPolygonNetwork()
            
            const elemActiveAccount = document.querySelector("header .active-account")
            if (accounts.length > 0 && elemActiveAccount) {
                elemActiveAccount.textContent = `${minimizeAddress(accounts)}`
            }

            location.reload()
        })
    },

    chainChanged() {
        // detect Chain account change
        window.ethereum.on("chainChanged", (chainId) => {
            // console.log("chainChanged", chainId)
            this.isPolygonNetwork()
        })
    },

    async isPolygonNetwork() {
        const accounts = await web3.eth.getAccounts()
        // validate only when connected
        if (accounts.length > 0) {

            // https://chainlist.org/
            const chainId = await web3.eth.getChainId()

            if (Number(chainId) === 137) { // currently only Polygon Mainnet
                closeOverlayPopup()
            } else {
                const arrNames = [
                    {name: "", class: "warning-icon"}, 
                    {name: "Please switch to Polygon chain.", class: "warning-text size-lgmd"}
                ]
                showOverlayPopup(null, createList(arrNames, "notpolygon"), false)
            }
        }
    },
}