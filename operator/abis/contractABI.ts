export const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "operatorID",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "requestID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "encryptedTaskData",
				"type": "string"
			}
		],
		"name": "RequestCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "requestID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "operatorID",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "taskResponse",
				"type": "string"
			}
		],
		"name": "RequestExecuted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operatorID",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "encryptedTaskData",
				"type": "string"
			}
		],
		"name": "createNewTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "requestID",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "encryptedTaskResponse",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "respondToTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];