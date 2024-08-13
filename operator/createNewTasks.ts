import { ethers } from 'ethers';

// Connect to the Ethereum network
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545`);

// Hardcoded Operator Addresss for Task Assignment
const operatorAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

// Replace with your own private key (ensure this is kept secret in real applications)
const privateKey = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const wallet = new ethers.Wallet(privateKey, provider);

// Replace with the address of your smart contract
const contractAddress = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB';

// The ABI provided
const contractABI = [
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

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to generate random names
function generateRandomName(): string {
    const adjectives = ['Quick', 'Lazy', 'Sleepy', 'Noisy', 'Hungry'];
    const nouns = ['Fox', 'Dog', 'Cat', 'Mouse', 'Bear'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomName = `${adjective}${noun}${Math.floor(Math.random() * 1000)}`;
    return randomName;
  }

  function generateRandomString(length: number = 12): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

async function createNewTask(taskName: string) {
  try {
    // Send a transaction to the createNewTask function
    const tx = await contract.createNewTask(operatorAddress,taskName);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

// Function to create a new task with a random name every 15 seconds
function startCreatingTasks() {
  setInterval(() => {
    const randomName = generateRandomString();
    console.log(`Creating new task with Backend UniqueID: ${randomName}`);
    createNewTask(randomName);
  }, 15000);
}

// Start the process
startCreatingTasks();