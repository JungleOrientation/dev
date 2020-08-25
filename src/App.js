import React, { Component } from "react";
import './App.css';
import {
  Box,
  Flex,
  Button,
  Text
} from 'rebass';
import { Label, Input } from '@rebass/forms';
import './design.css';
import Bucc from "./bucclogo.png";
import { ThemeProvider, withTheme } from 'emotion-theming';
import preset from '@rebass/preset';
import Web3 from 'web3';
import { buccm2ABI } from './abi.js';
var ethereum_address = require('ethereum-address');

const theme = {
  primary: 'black'
}
const adjustedTheme = ancestorTheme => ({ color: 'green' })

const contractAddress = "0x2dfc8f20085187aa4e1cd5a783774cd179c3c6fe";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.web3 = "";
    this.contractAddress = "";
    this.accounts = "";
    //Bindings
    this.userAddress = this.userAddress.bind(this);
    this.amountToSend = this.amountToSend.bind(this);
    this.findUserFunction = this.findUserFunction.bind(this);
    this.sendTx = this.sendTx.bind(this);
    //Set State
    this.state = {
      returnUserNumber: "",
      userNumber: 0,
      amountToSend: 0,
    }
  }

  componentDidMount = async () => {
    this.initateEthereum = this.initateEthereum.bind(this);
    this.initateEthereum();
  }

initateEthereum = async () => {
  if (typeof window.web3 !== 'undefined') {
  const that = this;
  this.getEthereumAccount = this.getEthereumAccount.bind(this);
    try {            
      await window.web3.currentProvider.enable().finally(
        async () => {
        that.getEthereumAccount();
        }
      );
    } catch (e) {
        console.log(e);
        this.setState({metaMask: "User likely rejected connection to the site."});
    }
  } else {
    console.log("Metamask not detected or installed.")
  }
  }

  getEthereumAccount = async () => {
    if (window.web3.currentProvider.selectedAddress !== null) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const buccm2API = await new web3.eth.Contract(buccm2ABI, contractAddress);
        //set the state variables for implementation
        this.setState({web3, accounts, buccm2API});
    }
  }

userAddress(address) {
  this.setState({userAddress: address.target.value});
}

amountToSend(amount) {
  this.setState({amountToSend: amount.target.value});
  console.log(this.state.amountToSend);
}

findUserFunction = async () => {
  this.setState({returnUserNumber: ""});
  var findAddress = String(this.state.userAddress);
  if (ethereum_address.isAddress(findAddress)) {
    var returnUserNumber = await this.state.buccm2API.methods.displayUserCount(findAddress).call({from: this.state.accounts[0]});
    if (returnUserNumber == 0) {
      this.setState({returnUserNumber: "This address has not been set up to receive transactions yet. To set it up, send a transaction of 0 BuccV2 to it from a different address than the one you are using now."});
      return;
    }
    var target = returnUserNumber;
    this.setState({target, returnUserNumber: "This address is now ready to accept transactions via the API. Please continue with your transaction."});
  }
  else {
    this.setState({returnUserNumber: "Not a valid ethereum address"});
  }
  
}

sendTx = async () => {
  this.setState({returnUserNumber: ""});
  try {
  var userNumber = String(this.state.target);
  console.log(this.state.amountToSend);
  var buccv2Amount = this.state.amountToSend.length + 10;
  var buccv2Amount = String(this.state.amountToSend).padEnd(buccv2Amount, 0);
  console.log(buccv2Amount);
  await this.state.buccm2API.methods.specialTransfer(userNumber, buccv2Amount).send({from: this.state.accounts[0]});
  this.setState({userAddress: "0x0000000000000000000000000000000000000000", buccv2Amount: 0, returnUserNumber: "Transaction successfully sent."});
  } catch (e) {
    this.setState({
    returnUserNumber: "Due to how Metamask works, you may need to refresh the page. If this issue persists then the Ethereum address entered is invalid."})
  }
}

  render () {
  return (
    <ThemeProvider theme={theme}>
     <ThemeProvider theme={adjustedTheme}>
    <Flex className="header">
     <Box width={1/3}>
     <Button className="wp" theme={preset} variant='outline' mr={2}>Manual</Button>
    </Box>
  <Box className="button-container"
    width={1/3}
    color='black'
    bg='white'>
    <img src={Bucc} className="logo" />
    <Text className="header"
      fontSize={[ 3, 4, 5 ]}
      fontWeight='bold'
      color='primary'>
      Buccaneer V2 API
    </Text>
    <br />
    <Text className="header"
      fontSize={[ 2 ]}
      color='primary'>{this.state.returnUserNumber}</Text>
    <br />
    
<Box
  sx={{
    display: 'grid',
    gridGap: 0,
    gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
  }}>
  <Text
  fontSize={[ 3 ]}
  color='primary'
  className="text">
  Recipient Address
</Text>
  <Box p={3}> 
  <Input className="input" onChange={this.userAddress} />
</Box>
</Box>

    <br />
    <Button  theme={preset} variant='outline' mr={2} onClick={this.findUserFunction}>Find</Button>
    <br />

<br />
<Box
  sx={{
    display: 'grid',
    gridGap: 0,
    gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
  }}>
  <Text
  fontSize={[ 3 ]}
  color='primary'
  className="text">
  Amount to Send
</Text>
  <Box p={3}> 
  <Input className="input" onChange={this.amountToSend} value={this.state.amountToSend} /></Box>
</Box>

  <br />
  <Button className="bottomButton" theme={preset} variant='outline' onClick={this.sendTx}>Send</Button>

  </Box>
  <Box width={1/3}>
    </Box>
</Flex>
</ThemeProvider>
</ThemeProvider>
  );
}
}

