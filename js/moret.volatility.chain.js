const displayVolatility = async (display, contract) => {
  display = await contract.methods.sayHello().call();
  $("home-desc").html(display);
};

// const updateGreeting = (display, contract, accounts) => {
//   let input;
//   $("#input").on("change", (e) => {
//     input = e.target.value;
//   });
//   $("#form").on("submit", async (e) => {
//     e.preventDefault();
//     await contract.methods
//       .updateGreeting(input)
//       .send({ from: accounts[0], gas: 40000 });
//     displayGreeting(display, contract);
//   });
// };

async function volatilityChainShowVolatility() {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  const contract = await getContract(web3, "./contracts/VolatilityChain.json", "0xf425f1274A20E801B9Bd8e6dF6414F0e337d5fba");

  let display;

  displayVolatility(display, contract);
  // updateGreeting(display, contract, accounts);
}

// const displayVolatilityButton = document.getElementById('join-us-button');
// displayVolatilityButton.onclick = volatilityChainShowVolatility;
