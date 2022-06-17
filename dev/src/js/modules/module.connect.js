import { gsap } from "gsap"
import { noScroll } from "../helpers/utils"
// import { onClickConnect } from "../web3/metamask"

export default {
    init() {
        const connectWallet = document.querySelector(".js-connectWallet")
        connectWallet.addEventListener("click", (e) => {
            e.preventDefault()
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

    async connectMetaMask(btn) {
        btn.innerHTML = 'Requesting';
        btn.disabled = true;

        try {

            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            await window.ethereum.request({ method: "eth_requestAccounts" })
            .then((result) => {
            // The result varies by by RPC method.
            // For example, this method will return a transaction hash hexadecimal string on success.
                console.log('result', result)
                // const opPanel = document.getElementsByClassName("overlay-popup");
                const opBox = document.getElementsByClassName("op-box");

                gsap.to(opBox, {
                    opacity: 0, scale: 0.5, duration: 0.35, onComplete: function () {
                        // var opPanel = document.querySelectorAll('overlay-popup');
                        // (opPanel[opPanel.length - 1]).remove();
                    }
                })

                const connectBtn = document.getElementsByClassName("js-connectWallet");
                connectBtn.innerHTML = 'Disconnect';
                // btn.disabled = true;

            // show all sections
            [].forEach.call(document.querySelectorAll('.connected'), function (el) {
                el.style.cssText = 'display:inline-block !important';
            });
            })
            .catch((error) => {
            // If the request fails, the Promise will reject with an error.
            console.log('promise error', error)
            throw error
            });

            await ethereum.request({method: 'eth_chainId'}).then((chainId)=>{
            console.log('chain', chainId);
            if(chainId==0x89 || chainId== 0x13881){
                // initialise web3 objects
                // initMarketMaker();
                btn.style.backgroundColor = "";
            }
            else{
                alert("You are not using Polygon chain. Please switch to Polygon network on your wallet.");
                console.log('Non-Polygon chain', chainId);
                // btn.innerHTML = 'Please use Polygon chain!';
                // btn.disabled = false;
                // btn.style.background='#FF0000';
                // btn.onclick = this;
            }
            })

        } catch (error) {
            console.log('error', error);

            btn.innerHTML = 'Connect to Wallet';
            btn.disabled = false;
            // btn.onclick = this;
        }
    }
}