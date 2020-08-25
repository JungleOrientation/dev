export const buccm2ABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "userDisplay",
				"type": "address"
			}
		],
		"name": "displayUserCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toIdentity",
				"type": "uint256"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "specialTransfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];