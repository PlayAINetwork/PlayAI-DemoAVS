// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@eigenlayer/contracts/libraries/BytesLib.sol";
import "@eigenlayer/contracts/core/DelegationManager.sol";
import "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import "@eigenlayer/contracts/permissions/Pausable.sol";
import {IRegistryCoordinator} from "@eigenlayer-middleware/src/interfaces/IRegistryCoordinator.sol";
import "./IPlayAIServiceManager.sol";

contract PlayAIServiceManager is 
    ECDSAServiceManagerBase,
    IPlayAIServiceManager,
    Pausable
{
    using BytesLib for bytes;
    using ECDSAUpgradeable for bytes32;

    /* STORAGE */
    uint32 public latestTaskNum;
    address public aggregrator;
    uint256 public RequestNumber = 0;
    enum RequestStatus { 
        Unassigned,
        Created, 
        Executed, 
        Cancelled
    }
    mapping(bytes32 => RequestStatus) public requests;
    mapping(bytes32 => address) public requestOperators;
    mapping(address => mapping(uint32 => bytes)) public allTaskResponses;

    /* MODIFIERS */
    modifier onlyOperator() {
        require(
            ECDSAStakeRegistry(stakeRegistry).operatorRegistered(msg.sender) 
            == 
            true, 
            "Operator must be the caller"
        );
        _;
    }

    modifier onlyAggregator(){
        require(msg.sender == aggregrator,"Only Aggregator");
        _;
    }

    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _delegationManager
    )
        ECDSAServiceManagerBase(
            _avsDirectory,
            _stakeRegistry,
            address(0), // hello-world doesn't need to deal with payments
            _delegationManager
        )
    {}


    /* FUNCTIONS */
    // Add a check later so only aggregator can add tasks 
    function createNewTask(
        address operatorID,
        string memory encryptedTaskData
    ) external {
        RequestNumber++;
        bytes32 requestID = keccak256(abi.encodePacked(operatorID, encryptedTaskData, block.timestamp,RequestNumber));
        require(requests[requestID]==RequestStatus.Unassigned,"Request is already created");
        requests[requestID]=RequestStatus.Created;
        requestOperators[requestID] = operatorID;
        emit RequestCreated(operatorID,requestID,encryptedTaskData);
    }

    // NOTE: this function responds to existing tasks.
    function respondToTask(
        bytes32 requestID,
        string memory encryptedTaskResponse,
        bytes calldata signature
    ) external onlyOperator {
        require(
            operatorHasMinimumWeight(msg.sender),
            "Operator does not have match the weight requirements"
        );
        // check that the task is valid, hasn't been responsed yet, and is being responded in time
        require(
            requests[requestID]==RequestStatus.Created,
            "Request doesn't exist or already executed"
        );
        require(
            requestOperators[requestID] == msg.sender,
            "Only the assigned operator can respond"
        );
        // The message that was signed
        bytes32 ethSignedMessageHash = requestID.toEthSignedMessageHash();

        // Recover the signer address from the signature
        address signer = ethSignedMessageHash.recover(signature);

        require(signer == msg.sender, "Message signer is not operator");
        requests[requestID]=RequestStatus.Executed;

        // emitting event
        emit RequestExecuted(requestID, signer, encryptedTaskResponse);
    }

    // Function is public to set aggregator should be secured later
    function initAggregator(address _aggregrator) external {
        aggregrator = _aggregrator;
    }

    // HELPER

    function operatorHasMinimumWeight(address operator) public view returns (bool) {
        return ECDSAStakeRegistry(stakeRegistry).getOperatorWeight(operator) >= ECDSAStakeRegistry(stakeRegistry).minimumWeight();
    }
}