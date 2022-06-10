import { gsap } from "gsap"
import { noScroll } from "../helpers/utils"

export default {
    init() {
        const connectWallet = document.querySelector(".js-connectWallet")
        connectWallet.addEventListener("click", () => {
            const arrNames = ["Metamask", "Walletconnect", "Coinbase"]
            this.overlayPopup("Connect Wallet", this.createList(arrNames, "connectwallets"))
        }, false)
    },

    createList(arrValues, className) {
        const listContainer = document.createElement("ul")
        listContainer.className = className
        for (const txtVal of arrValues) {
            const listItem = document.createElement("li")
            listItem.appendChild(document.createTextNode(txtVal))
            listContainer.appendChild(listItem)
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
            noScroll(false)
            gsap.to(opBox, {opacity: 0, scale: 0.5, duration: 0.35, onComplete: function(){
                opPanel.remove()
            }})
        }, false)

        const opContent = document.createElement("div")
        opContent.className = "op-content"
        opContent.appendChild(data)
        opBox.appendChild(opContent)

        // transition
        gsap.from(opBox, {opacity: 0, scale: 0.5})
    },
}