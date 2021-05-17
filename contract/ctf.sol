pragma solidity ^0.6.8;
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@opengsn/gsn/contracts/forwarder/IForwarder.sol";


interface payThem {
      function depositFor(address target) external payable;
}

contract CaptureTheFlag is BaseRelayRecipient {
    payThem public constructorOfPayThem;
    
    event FlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    function captureTheFlag() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();

        emit FlagCaptured(previousHolder, currentHolder);
    }

    function setTrustedForwarder(address forwarder) public {
        trustedForwarder = forwarder;
    }
    
    receive() external payable {
    }
    
    
    function relayHubDeposit(uint256 sendAmount, address sendTo) public payable {
        constructorOfPayThem = payThem(sendTo);
        constructorOfPayThem.depositFor.value(sendAmount)(address(this));
    }

    string public override versionRecipient = "2.0.0";
}