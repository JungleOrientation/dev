/*
- Use this script to add trusted forwarder to your contract
- Replace contractAddress, forwarderAddress, infura api key & private key with appropriate values
*/

const ethers = require("ethers");
const abi = require("./json_abi.json");

const pvt_key =
  "0x + private key";
const forwarderAddress = "0x956868751Cc565507B3B58E53a6f9f41B56bed74";
const contractAddress = "0xBEDfAAd294Ad8a5979D6Fc081f1239f1643A60ee";

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