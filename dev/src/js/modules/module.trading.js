import { gsap } from "gsap"
// import Web3 from "web3"

export default {
    globals: {
        elem: document.querySelector(".trading"),
        sideNavItems: [
            {token: "ETH", exhange: "USD", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"},
            {token: "BTC", exhange: "USD", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"},
        ]
    },

    async init() {
        const web3 = new Web3(window.ethereum)// || "http://localhost:3000")
        // Modern dapp browsers...
        // if (window.ethereum) {
        //     App.web3Provider = window.ethereum;
        //     try {
        //         // Request account access
        //         await window.ethereum.enable();
        //     } catch (error) {
        //         // User denied account access...
        //         console.error("User denied account access")
        //     }
        // }
        // // Legacy dapp browsers...
        // else if (window.web3) {
        //     App.web3Provider = window.web3.currentProvider;
        // }
        // // If no injected web3 instance is detected, fall back to Ganache
        // else {
        //     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:3000');
        // }
        
        // const web3 = new Web3(App.web3Provider);

        console.log(web3)

        const moretContract = await this.getContract(web3, '/src/json/Moret.json', "0x8f529633a6736E348a4F97E8E050C3EEd78C3C0a");

        // for (var tokenKey in tokenAddressMapping[chainId]) {
        let tokenAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; //tokenAddressMapping[chainId][tokenKey];
        let oracleAddress = await moretContract.methods.getVolatilityChain(tokenAddress).call();
        let oracle = await this.getContract(web3, '/src/json/VolatilityChain.json', oracleAddress);
        let tokenPrice = await oracle.methods.queryPrice().call();
        console.log(tokenPrice);
        // }
    

        this.sideNav()
        this.sideNavTest()
        this.animatePanels()
    },

    sideNav() {
        const localStorageName = "SideNavTokens"
        if (!localStorage.getItem(localStorageName)) {
            localStorage.setItem(localStorageName, JSON.stringify(this.globals.sideNavItems))
        }

        const sidenav = this.globals.elem.querySelector(".sidenav")

        // main
        const tokenMain = document.createElement("div")
        tokenMain.className = "token-main"
        sidenav.appendChild(tokenMain)

        const mainInfo = document.createElement("div")
        mainInfo.className = "token-info"
        tokenMain.appendChild(mainInfo)

        const mainArrow = document.createElement("div")
        mainArrow.className = "token-arrow"
        tokenMain.appendChild(mainArrow)

        // contents
        const tokenContents = document.createElement("div")
        tokenContents.className = "token-contents"
        sidenav.appendChild(tokenContents)

        const contentList = document.createElement("div")
        contentList.className = "token-list"
        tokenContents.appendChild(contentList)

        const contentInfo = document.createElement("div")
        contentInfo.className = "token-info"
        contentList.appendChild(contentInfo)

        JSON.parse(localStorage.getItem(localStorageName)).forEach((token, index) => {
            if (index < 1) {
                this.sideNavItem(mainInfo, token)
            } else {
                this.sideNavItem(contentInfo, token)
            }
        })
    },

    sideNavItem(parentElem, data) {
        const infoItem = document.createElement("div")
        infoItem.className = "info-item"
        parentElem.appendChild(infoItem)

        const tokenWrapper = document.createElement("div")
        tokenWrapper.className = "token-content-wrapper"
        infoItem.appendChild(tokenWrapper)

        const tokenContent = document.createElement("div")
        tokenContent.className = "token-content"
        tokenWrapper.appendChild(tokenContent)

        const tokenIcon = document.createElement("div")
        tokenIcon.className = "token-icon"
        tokenContent.appendChild(tokenIcon)

        const tokenIconImg = document.createElement("img")
        tokenIconImg.src = `/src/img/icon_${data.token.toLowerCase()}.svg`
        tokenIcon.appendChild(tokenIconImg)

        const tokenName = document.createElement("div")
        tokenName.className = "token-name"
        tokenName.textContent = `${data.token} - ${data.exhange}`
        tokenContent.appendChild(tokenName)

        const tokenPrice = document.createElement("div")
        tokenPrice.className = "token-price align-right"
        infoItem.appendChild(tokenPrice)
    },

    sideNavTest() {
        const sidenav = this.globals.elem.querySelector(".sidenav")
        const tokenArrow = sidenav.querySelector(".token-arrow")
        const tokenList = sidenav.querySelector(".token-list")
        const infoItems = tokenList.querySelectorAll(".info-item")
        const limitRows = 3

        // mobile hide/show
        tokenArrow.addEventListener("click", () => {
            if (sidenav.classList.contains("sidenav-mobile-active")) {
                sidenav.classList.remove("sidenav-mobile-active")
            } else {
                sidenav.classList.add("sidenav-mobile-active")
            }
        }, false)
        
        // limit content view
        infoItems.forEach((item, index) => {
            if (index > (limitRows - 1)) {
                item.classList.add("hide-important")
            }
        })

        if (infoItems.length > limitRows) {
            // create button view more
            const viewMore = document.createElement("div")
            viewMore.className = "token-viewmore"
            tokenList.appendChild(viewMore)

            const button = document.createElement("a")
            button.setAttribute("href", "#")
            button.className = "btn btn-white btn-viewmore size-sm"
            button.textContent = "View more"
            viewMore.appendChild(button)

            button.addEventListener("click", (e) => {
                e.preventDefault()
                infoItems.forEach((item) => item.classList.remove("hide-important"))
                viewMore.remove()
            }, false)
        }
    },

    animatePanels() {
        // automate transistion base on classname
        this.globals.elem.querySelectorAll(".animate-panel").forEach((panel, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio) {
                        panel.style.opacity = 1

                        const tl = gsap.timeline()
                        tl.from(panel, {opacity: 0, y: 200, delay: index * 0.1})

                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.25 })

            observer.observe(panel)
        })
    },

    async getContract(web3, path, address) {
        // const data = await $.getJSON(path);
        const response = await fetch(path);
        const data = await response.json();
        console.log(data.abi)
        // const netId = await web3.eth.net.getId();
        // const deployedNetwork = data.networks[netId];

        const contract = new web3.eth.Contract(
            data.abi,
            address
        );
        return contract;
    }
}