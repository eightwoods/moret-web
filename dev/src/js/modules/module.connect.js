import { gsap } from "gsap"
import { noScroll } from "../helpers/utils"
import { web3 } from "../helpers/web3"

export default {
    init() {
        this.accountsConnect()
        this.accountsChanged()
        this.chainChanged()
        this.accountsValidation()
    },

    createList(arrValues, containerClass) {
        const listContainer = document.createElement("ul")
        listContainer.className = containerClass
        
        for (const txtVal of arrValues) {
            const listItem = document.createElement("li")
            listItem.textContent = txtVal.name
            if (txtVal.class) {
                listItem.className = txtVal.class
            } else {
                listItem.className = txtVal.name.toLowerCase()
            }
            listContainer.appendChild(listItem)

            // events specific for connectwallets
            if (containerClass === "connectwallets") {
                listItem.addEventListener("click", (e) => {
                    switch (e.target.className) {
                        case "metamask":
                            this.connectMetaMask(listItem)
                            break;
                        case "walletconnect": break;
                        case "coinbase": break;
                        default:
                    }
                }, false)
            }
        }

        return listContainer
    },

    overlayPopup(title = null, data = null, btnClose = false) {
        noScroll()

        const opPanel = document.createElement("div")
        opPanel.className = "overlay-popup"
        document.body.appendChild(opPanel)

        const opBox = document.createElement("div")
        opBox.className = "op-box"
        opPanel.appendChild(opBox)

        if (title) {
            const opTitle = document.createElement("div")
            opTitle.className = "op-title header-title m-b-24"
            opTitle.textContent = title
            opBox.appendChild(opTitle)
        }

        const opClose = document.createElement("div")
        if (btnClose) {
            opClose.className = "op-close hide"
        } else {
            opClose.className = "op-close cursor"
        }
        opBox.appendChild(opClose)
        opClose.addEventListener("click", () => {
            this.closeOverlayPopup()
        }, false)

        const opContent = document.createElement("div")
        opContent.className = "op-content"
        opContent.appendChild(data)
        opBox.appendChild(opContent)

        // transition
        gsap.from(opBox, {opacity: 0, scale: 0.5})
    },

    closeOverlayPopup() {
        const overlayPopup = document.querySelector(".overlay-popup")
        if (overlayPopup) {
            noScroll(false)
            gsap.to(document.querySelector(".op-box"), {opacity: 0, scale: 0.5, duration: 0.35, onComplete: function(){
                overlayPopup.remove()
            }})
        }
    },

    async connectMetaMask(button) {
        button.textContent = "Requesting..."

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            .then((result) => {
                // console.log("result", result)
                // success
                this.closeOverlayPopup()
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
        ethereum.request({method: 'eth_accounts'})
        .then((accounts) => {
            const connectionButton = document.querySelector(".connection-button")
            if (connectionButton) {
                if (accounts.length > 0) {
                    // console.log("current account", accounts)
                    connectionButton.textContent = ""

                    const strAccounts = String(accounts)
                    const account = document.createElement("div")
                    account.className = "in-border white-50 icon icon-account"
                    account.textContent = `${strAccounts.substring(0, 4)}...${strAccounts.substring(strAccounts.length - 4)}`
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
                        this.overlayPopup("Connect Wallet", this.createList(arrNames, "connectwallets"))
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
            // if connected
            this.accountsValidation()
            // if disconnected
            if (accounts.length < 1) {
                location.reload()
            }
        })
    },

    chainChanged() {
        // detect Chain account change
        window.ethereum.on("chainChanged", (chainId) => {
            // console.log("chainChanged", chainId)
            this.accountsValidation()
        })
    },

    async accountsValidation() {
        const accounts = await web3.eth.getAccounts()
        // validate only when connected
        if (accounts.length > 0) {

            // https://chainlist.org/
            const chainId = await web3.eth.getChainId()

            if (Number(chainId) === 137) { // currently only Polygon Mainnet
                this.closeOverlayPopup()
            } else {
                const arrNames = [
                    {name: "", class: "np-icon"}, 
                    {name: "This is not a “Polygon” blockchain!", class: "np-text size-lgmd"}
                ]
                this.overlayPopup(null, this.createList(arrNames, "notpolygon"), true)
            }
        }
    },
}