
const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // ask user permission to access his accounts
          window.ethereum.request({ method: "eth_requestAccounts" });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      else if (window.web3)
      {
        const web3 = window.web3;
        resolve(web3);
      }
      else {
        const provider = Web3.providers.HttpProvider("https://kovan.infura.io/v3/8b982c2ec1ba43b289f10b475994cc9f");
        const web3 = new Web3(provider);
        console.log("no MetaMask installed.must install MetaMask");
      }
    });
  });
};


const getContract = async (web3, path) => {
  const data = await $.getJSON(path);

  const netId = await web3.eth.net.getId();
  const deployedNetwork = data.networks[netId];
  const contract = new web3.eth.Contract(
    data.abi,
    deployedNetwork && deployedNetwork.address
  );
  return contract;
};
