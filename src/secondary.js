import React, { Component, Suspense } from "react";

/* BOOTSTRAP IMPORTS */
//Elements
import Navbar from 'react-bootstrap/Navbar';
//Layouts
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

//CSS edits
import 'bootstrap/dist/css/bootstrap.min.css';
import './loader.css';
import './design.css';


//General Style Imports
import twitter from './twitterLogo.png';
import telegram from './telegramLogo.png';

//REBASS STYLES
import {
  Button,
  Text
} from 'rebass';
import preset from '@rebass/preset';

import { Input } from '@rebass/forms';
import Bucc from "./black.png";
import Web3 from 'web3';
import { buccm2ABI } from './abi.js';

var ethereum_address = require('ethereum-address');



const contractAddress = "0xd5a7d515fb8b3337acb9b053743e0bc18f50c855";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.web3 = "";
    this.contractAddress = "";
    this.accounts = "";
    //Bindings
    this.userAddress = this.userAddress.bind(this);
    this.amountToSend = this.amountToSend.bind(this);
    this.sendTx = this.sendTx.bind(this);
    this.setupLoader = this.setupLoader.bind(this);
    //Set State
    this.state = {
      returnUserNumber: "",
      displayErrorMessage: false,
      userNumber: 0,
      amountToSend: "",
      target: 0,
      loader: true,
      percentageLoader: "0%",
      visibility: "visible",
      loaderCSS: "loaderCoverSheet"
    }
    document.body.style.overflowY = "hidden";
  }

  componentDidMount = async () => {
    //this.setupLoader();
    this.initateEthereum = this.initateEthereum.bind(this);
    this.initateEthereum();
  }

  setupLoader = async () => {
    var that = this;
    setTimeout(function(){that.setState({percentageLoader: "95%", loaderCSS: "loaderCoverSheet2"});
    document.body.style.overflowY = "scroll";}, 280);
    setTimeout(function(){that.setState({loader: false, loaderCSS: "loaderCoverSheet2"});}, 300);
    }

initateEthereum = async () => {
  if (typeof window.web3 !== 'undefined') {
  const that = this;
  this.setState({percentageLoader: "Web3 Sign-In"});
  this.getEthereumAccount = this.getEthereumAccount.bind(this);
    try {            
      await window.web3.currentProvider.enable().finally(
        async () => {
        that.setState({percentageLoader: "25%"});
        that.getEthereumAccount();
        that.setState({percentageLoader: "50%"});
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
      this.setState({percentageLoader: "60%"});
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        this.setState({percentageLoader: "80%"});
        const buccm2API = await new web3.eth.Contract(buccm2ABI, contractAddress);
        //set the state variables for implementation
        this.setState({web3, accounts, buccm2API});
        this.setState({percentageLoader: "90%"});
        this.setupLoader();
    }
  }

userAddress(address) {
  this.setState({userAddress: address.target.value});
}

amountToSend(amount) {
  this.setState({amountToSend: amount.target.value});
  console.log(this.state.amountToSend);
}


sendTx = async () => {
  var that = this;
  this.setState({returnUserNumber: "Attempting...", displayErrorMessage: true});
  var findAddress = String(this.state.userAddress);
  if (findAddress == contractAddress) {
    this.setState({displayErrorMessage: true, returnUserNumber: "You cannot send tokens to the contract address, through the API."});
    setTimeout(function(){that.setState({displayErrorMessage: false, returnUserNumber: ""});}, 5000);
    return;
  }
  this.setState({returnUserNumber: "Attempting... 10%"});
  if (ethereum_address.isAddress(findAddress)) {
    var target = String(await this.state.buccm2API.methods.displayUserCount(findAddress).call({from: this.state.accounts[0]}));
    this.setState({returnUserNumber: "Recipient info found... 25%"});
    if (target == 0) {
        this.setState({target, displayErrorMessage: true, returnUserNumber: "This address has not been set up to receive transactions yet. To set it up, send a transaction of 0 BUCC to it from a different address than the one you are using now."});
        setTimeout(function(){that.setState({displayErrorMessage: false, returnUserNumber: ""});}, 5000);
        return;
      }
      try {
        console.log(target);
        var buccv2Amount = String(Math.round(this.state.amountToSend * 10000000000));
        console.log(buccv2Amount);
        this.setState({returnUserNumber: "Converting... 40%"});
            try {
            this.setState({returnUserNumber: "Sending... 70%"});
            await this.state.buccm2API.methods.specialTransfer(target, buccv2Amount).send({from: this.state.accounts[0]});
            } catch (e) {
              this.setState({
                displayErrorMessage: true, returnUserNumber: "Failed contract interaction. User likely rejected transaction or information was not put in correctly."});
                setTimeout(function(){that.setState({displayErrorMessage: false, returnUserNumber: ""});}, 5000);
                return;
            }
          this.setState({userAddress: "0x0000000000000000000000000000000000000000", buccv2Amount: 0, returnUserNumber: "Transaction successfully sent. The page is refreshing in 10 seconds."});
          setTimeout(function(){that.setState({displayErrorMessage: false, returnUserNumber: ""});}, 5000);
          setTimeout(() => {
            window.location.reload();
          }, 10000);
      } catch (e) {
        this.setState({
        displayErrorMessage: true, returnUserNumber: "Due to how Metamask works, you may need to refresh the page. If this issue persists then the Ethereum address entered is invalid."});
        console.log(e);
      }
  } else {
    this.setState({displayErrorMessage: true, returnUserNumber: "Not a valid ethereum address"});
  }
  setTimeout(function(){that.setState({displayErrorMessage: false, returnUserNumber: ""});}, 5000);
}

  render () {
  return (
    <>

        <Suspense>
        { this.state.loader && (
            <React.Fragment>
            <div className={this.state.loaderCSS}>
            <Container>
            <Row>
            <Col>
            <div class="loader">
            <div class="inner one"></div>
            <div class="inner two"></div>
            <div class="inner three"></div>
            </div>
            </Col>
            </Row>
            <Row>
            <Col>
            <span className="loaderText loaderLight">Loading... {this.state.percentageLoader}</span>
            </Col>
            </Row>
            </Container>
            </div>
            </React.Fragment>
          )}
        </Suspense>
    
        <Navbar>
        <Navbar.Brand href="#home">
        <Container>
          <Row>
              <Col>
              <a href="https://buccaneer.eth" target="_blank"><Button className="buttonFormat" theme={preset} variant='outline' mr={2}>Homepage</Button></a>
              </Col>
              <Col>
              <a href="https://ipfs.io/ipfs/QmUDSvUDtw1DUvjHbnU18Q8n4nSNo41VAYNM1goE4xE2jP" target="_blank"><Button className="buttonFormat" theme={preset} variant='outline'>WP</Button></a>
              </Col>
              <Col>
              <a href="https://ipfs.io/ipfs/QmQfDJCw6X2cvgaA3sB3YnyJrjLSgJb1N5xzzC8iszr7Tw" target="_blank"><Button className="buttonFormat" theme={preset} variant='outline' mr={2}>Manual</Button></a>
              </Col>
              <Col>
              <a href="https://buccfarm.eth/" target="_blank"><Button className="buttonFormat" theme={preset} variant='outline' mr={2}>Sargasso</Button></a>
              </Col>
              <Col>
              <a href="https://bucctumbler.eth/" target="_blank"><Button className="buttonFormat" theme={preset} variant='outline' mr={2}>Havok</Button></a>
              </Col>
          </Row>
        </Container> 
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          <a href="https://t.me/BuccaneerV2"><img src={telegram} className="shareButtonSpacing" /></a>
            <a href="https://twitter.com/BuccaneerV2"><img src={twitter} className="shareButtonSpacing" /></a>
          </Navbar.Text>
        </Navbar.Collapse>
        </Navbar>

        
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
                    Bermuda
                  </Text>
                  <br />
                  </Col>
                  <Col md={3}>
                  </Col>
                  </Row>

                  <Suspense>
                  { this.state.displayErrorMessage && (
                  <Row>
                    <Col md={2}>
                    </Col>

                        <Col>
                        <br />
                        <Text
                            fontSize={[ 3 ]}
                            color='primary'
                            className="text specialErrorHighlight">
                          {this.state.returnUserNumber}
                        <br />
                        <br />                           
                        </Text>
                        </Col>

                    <Col md={2}>
                    </Col>
                  </Row>
                  )}
                  </Suspense>
                    
                    <Row>
                      <Col md={4}>
                      </Col>
                      <Col md={4}>
                          <Text
                            fontSize={[ 3 ]}
                            color='primary'
                            className="text">
                            Recipient Address
                          </Text>
                          <Input className="input" onChange={this.userAddress} />
                      </Col>
                      <Col md={4}>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                      </Col>
                      <Col md={4}>
                          <Text
                            fontSize={[ 3 ]}
                            color='primary'
                            className="text">
                            Amount to Send
                          </Text>  
                          <Input className="input" onChange={this.amountToSend} value={this.state.amountToSend} />
                      </Col>
                      <Col md={4}>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                      </Col>
                      <Col md={4}>  
                      <Button className="bottomButton buttonFormat" theme={preset} variant='outline' onClick={this.sendTx}>Send</Button>
                      </Col>
                      <Col md={4}>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={1}>
                      </Col>
                      <Col md={10}>  
                      <Card variant="dark" bg="blackbg" className="text-center lastCard">
                      <Card.Body className="adjustCardBody">
                                <Text
                                  className="text"
                                  fontSize={[ 5 ]}
                                  fontWeight='bold'>
                                  Important Instructions
                                </Text>
                                <hr className="whiteHRLINE" />
                                <Text
                                  fontSize={[ 2 ]}
                                  color='primary'
                                  className="text">
                                Read the <a href="https://ipfs.io/ipfs/QmUDSvUDtw1DUvjHbnU18Q8n4nSNo41VAYNM1goE4xE2jP" target="_blank">Whitepaper/Manual</a> as well as <a href="https://ipfs.io/ipfs/QmQfDJCw6X2cvgaA3sB3YnyJrjLSgJb1N5xzzC8iszr7Tw">
                                Visual Guide</a> before conducting any transactions.
                                </Text>
                                <hr className="whiteHRLINE" />
                              </Card.Body>
                      </Card>
                      </Col>
                      <Col md={1}>
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