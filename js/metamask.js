
// const forwarderOrigin = 'http://localhost:9010';
const connectButton = document.getElementById('connectButton');

//We create a new MetaMask onboarding object to use in our app
const onboarding = new MetaMaskOnboarding({});

const MetaMaskClientCheck = () => {
  console.log('MetaMaskClientCheck')

  //Now we check to see if Metmask is installed
  if (!isMetaMaskInstalled) {
    console.log('not installed')

    //If it isn't installed we ask the user to click to install it
    connectButton.innerText = 'Click here to install MetaMask!';
    //When the button is clicked we call this function
    connectButton.onclick = onClickInstall;
    //The button is now disabled
    connectButton.disabled = false;
  } else {
    console.log('installed')
    onClickConnect();
  }
};

//Created check function to see if the MetaMask extension is installed
const isMetaMaskInstalled = () => {
  console.log('isMetaMaskInstalled')

  //Have to check the ethereum binding on the window object to see if it's installed
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};

const onClickConnect = async () => {
  console.log('onClickConnect')
  connectButton.innerHTML = 'Requesting';
  connectButton.disabled = true;

  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    await window.ethereum.request({ method: "eth_requestAccounts" })
    .then((result) => {
      // The result varies by by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
      console.log('result', result)

      connectButton.innerHTML = 'Connected';
      connectButton.disabled = true;

      // show all sections
      [].forEach.call(document.querySelectorAll('.connected'), function (el) {
        el.style.cssText = 'display:inline-block !important';
      });

      // initialise web3 objects
      initMarketMaker();
    })
    .catch((error) => {
      // If the request fails, the Promise will reject with an error.
      console.log('promise error', error)
      throw error
    });
  } catch (error) {
    console.log('error', error);

    connectButton.innerHTML = 'Connect to Wallet';
    connectButton.disabled = false;
    connectButton.onclick = this;
  }
};

// Initialise on DOM loaded
console.log('init')
window.addEventListener('DOMContentLoaded', MetaMaskClientCheck);