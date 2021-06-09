import React, { Component } from "react";

/* BOOTSTRAP IMPORTS */
//Layouts
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//CSS edits
import "bootstrap/dist/css/bootstrap.min.css";
import "./design.css";

//REBASS STYLES
import { Button, Text } from "rebass";
import preset from "@rebass/preset";
import Web3 from "web3";
import { abiCTF } from "./abi.js";

//GSN TEST BASED ADDRESS
const contractAddress = "0xCB05F0c5cB992b79fD1908eaC2f6e91f192f0D42";
const trustedForwarder = "0x83A54884bE4657706785D7309cf46B58FE5f6e8a";
const paymaster = "0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016";

/* 
GSN RELATED FUNCTIONS
*/
const { RelayProvider } = require("@opengsn/provider");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.accounts = "";
    this.useGSN = this.useGSN.bind(this);
    //Set State
    this.state = {
      SignatureRequest: "",
    };
  }

  componentDidMount = async () => {
    //this.setupLoader();
    this.initateEthereum = this.initateEthereum.bind(this);
    await this.initateEthereum();
  };

  initateEthereum = async () => {
    if (typeof window.ethereum !== "undefined") {
      //const that = this;
      this.setState({ percentageLoader: "Web3 Sign-In" });
      await window.ethereum.enable();
      this.getEthereumAccount = this.getEthereumAccount.bind(this);
      await this.getEthereumAccount();
    } else {
      console.log("Metamask not detected or installed.");
    }
  };

  getEthereumAccount = async () => {
    let web3;

    //
    const config = {
      paymasterAddress: paymaster,
      relayHubAddress: "0x6650d69225CA31049DB7Bd210aE4671c0B1ca132",
      stakeManagerAddress: "0x6ef9595244c2Cd9BD89af56607283784b5a9499C",
      jsonStringifyRequest: true,
      chainId: window.ethereum.networkVersion,
      maxRelayNonceGap: 100,
    };

    const provider = await RelayProvider.newProvider({
      provider: window.ethereum,
      config,
    }).init();
    console.log(provider);
    web3 = new Web3(provider);
    const GSNcontract = await new web3.eth.Contract(abiCTF, contractAddress);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log(GSNcontract);

    this.setState({ GSNcontract, accounts, web3 });
  };

  useGSN = async () => {
    const contract_obj = this.state.GSNcontract;
    await contract_obj.methods
      .captureTheFlag()
      .send({ from: this.state.accounts[0]});
  };

  render() {
    return (
      <>
        <Container fluid className={this.state.bodyLoaderCSS}>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <Container className="text-center bottomofPage">
                <Row>
                  <Col md={3}></Col>
                  <Col md={6} className="text-center">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <Text
                      className="headerText"
                      fontSize={[3, 4, 5]}
                      fontWeight="bold"
                    >
                      GSN Test
                    </Text>
                    <br />
                  </Col>
                  <Col md={3}></Col>
                </Row>

                <Row>
                  <Col md={4}></Col>
                  <Col md={4}>
                    <Button
                      className="bottomButton buttonFormat"
                      theme={preset}
                      variant="outline"
                      onClick={this.useGSN}
                    >
                      Use GSN
                    </Button>
                  </Col>
                  <Col md={4}></Col>
                </Row>
              </Container>
            </Col>
            <Col md={2}></Col>
          </Row>
        </Container>
      </>
    );
  }
}
