/*
- Use this script to add trusted forwarder to your contract
- Replace contractAddress, forwarderAddress, infura api key & private key with appropriate values
*/

const ethers = require("ethers");
const abi = require("./json_abi.json");

const pvt_key =
  "0x + private key";
const forwarderAddress = "0x83A54884bE4657706785D7309cf46B58FE5f6e8a";
const contractAddress = "0xCB05F0c5cB992b79fD1908eaC2f6e91f192f0D42";

async function exec() {
  const provider = new ethers.providers.JsonRpcBatchProvider(
    "https://rinkeby.infura.io/v3/API_KEY"
  );

  const sgnr = new ethers.Wallet(pvt_key, provider);

  const ctf_contract = new ethers.Contract(contractAddress, abi);
  const sgn_contract = ctf_contract.connect(sgnr);

  sgn_contract.setTrustedForwarder(forwarderAddress).then(console.log)
}

exec()