// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IPlayAIServiceManager {
    // EVENTS
    event RequestCreated(address operatorID, bytes32 requestID, string encryptedTaskData);
    event RequestExecuted(bytes32 requestID, address operatorID,string taskResponse);

    // STRUCTS
    struct Task {
        string name;
        uint32 taskCreatedBlock;
    }

    // FUNCTIONS
    // NOTE: this function creates new task.
    function createNewTask(
        address operatorID,
        string memory encryptedTaskData
    ) external;

    // NOTE: this function is called by operators to respond to a task.
    function respondToTask(
        bytes32 requestID,
        string memory encryptedTaskResponse,
        bytes calldata signature
    ) external;
}