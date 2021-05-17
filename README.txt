# GSN V2

The issue is upon pressing the button "use gsn", an error is returned.

```bash
Unhandled Rejection (Error): Rejected relayTransaction call - should not happen. Reason: {"code":-32000,"message":"gas required exceeds allowance (0)"}
```
To run the project.

```bash
npm install
```
```bash
npm start
```
Should be on localhost:3000

## The Error

I have not setup a relay server and do not know how to connect to it. If plausible, use the testnet rinkeby which does have a relay server and if you can make a separate contract instance for mainnet, that would be great. There is an issue with BSC, which apparently does not have a relay server. We can discuss that later, to set one up for us. Whatever gas costs are associated with the mainnet contract deployment, let me know, we will of course cover these costs.

## The Contract
There is a simple contract attached in the contract folder, it can of course be deployed on remix. It is a simple deployment of the simple capture the flag contract offered by GSN however, it has an additional receivable function whose purpose is to accept testnet ether (or ether) and then a deposit function which allows the deposit from that contract to the relayhub. It seems I cannot figure out the gas issue, which again I believe is the relay server but maybe I'm not staking here.

## Task
If you are able to make that button work on the rinkeby contract, that is your task. But as well, if you're able to implement a way for a contract to figure out the gas costs associated with the tx so that a function can take that and deliver a gas cost to a user for our work down the road. 


## Separate Stuff
We will pay you an additional amount after you are done with the current task; 
1. set the contract up on mainnet.
2. create a relay server on BSC.