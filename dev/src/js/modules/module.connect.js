import { gsap } from "gsap"
import { noScroll } from "../helpers/utils"
// import { onClickConnect } from "../web3/metamask"

export default {
    init() {
        this.accountsConnect()
        this.accountsChanged()
    },

    createList(arrValues, className) {
        const listContainer = document.createElement("ul")
        listContainer.className = className
        for (const txtVal of arrValues) {
            const listItem = document.createElement("li")
            listItem.appendChild(document.createTextNode(txtVal))
            listItem.className = txtVal.toLowerCase()
            listContainer.appendChild(listItem)

            listItem.addEventListener("click", () => {
                if (listItem.classList.contains("metamask")) {
                    console.log("metamask")
                    this.connectMetaMask(listItem)
                } else {
                    console.log("others...")
                }
            }, false)
        }

        return listContainer
    },

    overlayPopup(title = null, data = null) {
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
        opClose.className = "op-close cursor"
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
        noScroll(false)
        gsap.to(document.querySelector(".op-box"), {opacity: 0, scale: 0.5, duration: 0.35, onComplete: function(){
            document.querySelector(".overlay-popup").remove()
        }})
    },

    async connectMetaMask(button) {
        button.textContent = "Requesting..."

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            .then((result) => {
                console.log("result", result)
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
                        const arrNames = ["Metamask", "Walletconnect", "Coinbase"]
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

    async accountsChanged() {
        ethereum.on("accountsChanged", () => {
            // location.reload()

            ethereum.request({method: 'eth_chainId'}).then((chainId)=>{
                console.log('chain', chainId)
                if(chainId==0x89 || chainId== 0x13881){
                    console.log('yes', chainId)
                }
                else{
                    alert("You are not using Polygon chain. Please switch to Polygon network on your wallet.")
                    console.log('Non-Polygon chain', chainId)
                }
            })

        })
    },
}