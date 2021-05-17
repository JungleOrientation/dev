import React, { Component } from "react";

/* BOOTSTRAP IMPORTS */
//Layouts
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//CSS edits
import 'bootstrap/dist/css/bootstrap.min.css';
import './loader.css';
import './design.css';

//REBASS STYLES
import {
  Button,
  Text
} from 'rebass';
import preset from '@rebass/preset';
import Bucc from "./black.png";
import Web3 from 'web3';

//CTF based technology
import { abiCTF } from './abi.js';
//import ethers from 'ethers';

//GSN TEST BASED ADDRESS
const contractAddress = "0xaBC02587C15a3B970E407353881920F72C7C63e2";
const trustedForwarder = "0x956868751Cc565507B3B58E53a6f9f41B56bed74";
const paymaster = "0x43d66E6Dce20264F6511A0e8EEa3f570980341a2";


/* 
GSN RELATED FUNCTIONS
*/

//const { GSNDevProvider } = require("@opengsn/gsn");

const { RelayProvider } = require('@opengsn/gsn');


export default class App extends Component {
  constructor(props) {
    super(props);
    this.web3 = "";
    //this.contractAddress = "";
    this.accounts = "";
    //this.SignatureRequest = "";
    this.useGSN = this.useGSN.bind(this);
    //this.initSigner = this.initSigner.bind(this);
    //Bindings
    //Set State
    this.state = {
      SignatureRequest: "",
    }
  }

  componentDidMount = async () => {
    //this.setupLoader();
    this.initateEthereum = this.initateEthereum.bind(this);
    this.initateEthereum();
  }

initateEthereum = async () => {
  if (typeof window.web3 !== 'undefined') {
        //const that = this;
        this.setState({percentageLoader: "Web3 Sign-In"});
        await window.web3.currentProvider.enable();
        //this.getEthereumAccount = this.getEthereumAccount.bind(this);
        //this.getEthereumAccount();         
        
    } else {
      console.log("Metamask not detected or installed.")
    }
  }

  useGSN = async () => {
    //if (window.web3.currentProvider.selectedAddress !== null) {
        //const web3 = new Web3(window.ethereum);
        //attempt to link web3 to variable 2.
        //const regularProvider = web3.currentProvider;
        //const regularProvider = web3.currentProvider;

      /*
      const devConfig = {
        relayOwner: accounts[0],
        relayHubAddress: relayHub.address
      }
      const gsnDevProvider = new GSNDevProvider(regularProvider, devConfig);
      web3.setProvider(devProvider);

  
      const configuration = { relayHubAddress: relayHub.address, stakeManagerAddress: stakeManager.address };
      const provider = new RelayProvider(web3.currentProvider, configuration);
      const web3 = new Web3(provider);
      */
     
        const configuration = { relayHubAddress: "0x53C88539C65E0350408a2294C4A85eB3d8ce8789", 
        stakeManagerAddress: "0x6ef9595244c2Cd9BD89af56607283784b5a9499C" };

        //const provider = new RelayProvider(web3.currentProvider, configuration);

        const provider = new RelayProvider(window.ethereum, configuration);
        

        //const provider = RelayProvider.newProvider({window.ethereum, configuration});
        const web3 = new Web3(provider);
        
        //const buccm2API = await new web3.eth.Contract(buccm2ABI, contractAddress);
        const GSNcontract = await new web3.eth.Contract(abiCTF, contractAddress);

        console.log(GSNcontract);

       // const accounts = await web3.eth.getAccounts();
        //const GSNcontract = await new web3.eth.Contract(abiCTF, contractAddress);
        //set the state variables for implementation
        //this.setState({web3, accounts, GSNcontract});
        this.setState({web3, GSNcontract});
        //console.log(this.state.accounts[0]);
        //this.initSigner();
    //}
  }

  /*
  //init Signer, connect to web3, create a signer and initiate transactions
  initSigner = async () => {
    //replace with web3 in this instance
    //1. get web3
    const web3Provider = window.ethereum;
    //2. get provider through ethers
    const provider = new ethers.providers.Web3Provider(web3Provider);
    //const network = await provider.getNetwork()
    //this is an address to be interacted with based on the network usage to allow seamless transfers of the account
    /*
    let net = networks[network.chainId]
    if (!net) {
      net = {
        ctf: require('@ctf/eth/deployments/localhost/CaptureTheFlag.json').address
      }
    }
 
    //Returns a JsonRpcSigner which is managed by this Ethereum node, at addressOrIndex. If no addressOrIndex is provided, the first account (account #0) is used.
    //establish the signer
    const signer = provider.getSigner();
    //return address of the contract
    const SignatureRequest = new ethers.Contract(contractAddress, abiCTF, signer);
    console.log(SignatureRequest);
    //const SignatureRequest = new Ctf(contractAddress, signer);
    this.setState({SignatureRequest});
    //return new Ctf(net.ctf, signer)
  }
  */
/*
  useGSN = async () => {
    //await this.state.SignatureRequest.methods.captureTheFlag();
    //await this.state.SignatureRequest.methods.captureTheFlag().send({from: this.state.accounts[0]});
    console.log(this.state.GSNcontract);
    await this.state.GSNcontract.methods.captureTheFlag().send({ from: paymaster, trustedForwarder, gas: 0, gasPrice: 0});


    //await this.state.GSNcontract.methods.captureTheFlag().send({from: trustedForwarder});
  }
*/
  render () {
  return (
    <>
        
     <Container fluid className={this.state.bodyLoaderCSS}>
      <Row>
      <Col md={2}>
      </Col>
      <Col md={8}>
            <Container className="text-center bottomofPage">
                <Row>
                  <Col md={3}>
                  </Col>
                  <Col md={6} className="text-center">
                  <img src={Bucc} className="logo" />
                  <br />
                  <Text className="headerText"
                    fontSize={[ 3, 4, 5 ]}
                    fontWeight='bold'>
                    GSN Test
                  </Text>
                  <br />
                  </Col>
                  <Col md={3}>
                  </Col>
                  </Row>
                    
                    <Row>
                      <Col md={4}>
                      </Col>
                      <Col md={4}>  
                      <Button className="bottomButton buttonFormat" theme={preset} variant='outline' onClick={this.useGSN}>Use GSN</Button>
                      </Col>
                      <Col md={4}>
                      </Col>
                    </Row>
            </Container>
      </Col>
      <Col md={2}>
      </Col>
      </Row>
      </Container>

  </>
  );
}
}

