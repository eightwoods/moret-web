
const forwarderOrigin = 'http://localhost:9010';

const initialize = () => {
  //You will start here
  const onboardButton = document.getElementById('connectButton');



  //------Inserted Code------\\

  const MetaMaskClientCheck = () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect to Wallet';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();
  //------/Inserted Code------\\

};
window.addEventListener('DOMContentLoaded', initialize);

//Created check function to see if the MetaMask extension is installed
const isMetaMaskInstalled = () => {
  //Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

//We create a new MetaMask onboarding object to use in our app
const onboarding = new MetaMaskOnboarding({  });

//This will start the onboarding proccess
const onClickInstall = () => {
  onboardButton.innerText = 'Onboarding in progress';
  onboardButton.disabled = true;
  //On this object we have startOnboarding which will start the onboarding process for our end user
  onboarding.startOnboarding();
};

const onClickConnect = async () => {
  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    await window.ethereum.request({ method: "eth_requestAccounts" });
    onboardButton.innerText = 'Connected';
    onboardButton.disabled = true;
  } catch (error) {
    console.error(error);
    onboardButton.innerText = 'Connect to Wallet';
    onboardButton.disabled = false;
  }
};
