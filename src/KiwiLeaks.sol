// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @author Iker Ruiz de Infante Gonzalez (iruizdeinfante001@ikasle.ehu.eus)
/// @title KiwiLeaks
/**
 * @notice Contract created for the Ethereum programming course
 * of the Blockchain Technology and Cryptocurrencies master's degree
 * at the University of the Basque Country.
 */
contract KiwiLeaks {

    /// @dev Maximum number of chars permitted in a leaked info
    uint private constant MAX_LEN = 280;
    
    /// @dev Number of decimals on the KWC token contract
    uint private constant DECIMALS = 18;
    
    /// @dev Address of the owner of the contract
    address payable private _owner;
    
    /// @dev KWC token contract
    IERC20 private _KWCcontract;
    
    /**
     * @dev Array containing the hashes of the leaked info
     * (the hash represents only the 'text' attribute of the Leak struct)
     */
    bytes32[] private _leaksHashes;
    
    /**
     * @dev Map containing the leaked info identified by each hash
     * (the hash represents only the 'text' attribute of the Leak struct)
     */
    mapping(bytes32 => Leak) private _leaks;
    
    /**
     * @dev Sets the owner of the contract as the one who deploys it
     * @param KWCtoken: the address of the Kiwicoin (KWC) token contract
     */
    constructor(address KWCtoken) {
        _owner = payable(msg.sender);
        _KWCcontract = IERC20(KWCtoken);
    }
    
    /// @dev Getter for the 'MAX_LEN' constant
    function getMaxLen() external view onlyOwner returns (uint) {
        return MAX_LEN;
    }
    
    /**
     * @dev Shortens the info to be leaked if it's longer that MAX_LEN chars
     * Then publishes a new leak if the info wasn't previously published
     * or if it was unpublished (fails in other case)
     * @param leakString: the info to be leaked
     */
    function publishLeak(string memory leakString) external onlyOwner {
        bytes memory leakBytes = bytes(leakString);
        uint len = leakBytes.length > MAX_LEN ? MAX_LEN : leakBytes.length;
        
        bytes memory saveBytes = new bytes(len);
        for(uint i = 0; i <= MAX_LEN; i++) {
            saveBytes[i] = leakBytes[i];
            if(i == len - 1) break;
        }
        
        Leak memory existing = _leaks[keccak256(saveBytes)];
        require(existing.date == 0 || (existing.date != 0 && !existing.isPublic), "Leak already published");
        if(existing.date == 0) _leaksHashes.push(keccak256(saveBytes));
        _leaks[keccak256(saveBytes)] = Leak(string(saveBytes), block.timestamp, true);
        
        emit LeakPublished(keccak256(saveBytes));
    }
    
    /**
     * @dev Unpublishes a leak identified by its hash if
     * it exists and it's published (fails in other case)
     * @param hash: identifier of the leak in the '_leaks' mapping
     * to be unpublished
     */
    function unpublishLeak(bytes32 hash) external onlyOwner {
        Leak storage existing = _leaks[hash];
        require(existing.date != 0 && existing.isPublic, "Leak not published");
        existing.isPublic = false;
        
        emit LeakUnpublished(hash);
    }
    
    /// @dev Returns an array with all the published leaks
    function getLeaks() external view returns (Leak[] memory) {
        uint len = 0;
        for(uint i = 0; i < _leaksHashes.length; i++) {
            if(_leaks[_leaksHashes[i]].isPublic) len++;
        }
        
        Leak[] memory leaksArray = new Leak[](len);
        uint count = 0;
        for(uint i = 0; i < _leaksHashes.length; i++) {
            if(_leaks[_leaksHashes[i]].isPublic) {
                leaksArray[count++] = _leaks[_leaksHashes[i]];
            }
        }
        
        return leaksArray;
    }
    
    /**
     * @dev Returns a leak if exists and it's published (fails in other case)
     * @param hash: identifier of the leak in the '_leaks' mapping
     */
    function getLeakByHash(bytes32 hash) external view returns (Leak memory) {
        Leak memory leak = _leaks[hash];
        require(leak.date != 0 && leak.isPublic, "Leak not published");
        return leak;
    }
    
    /// @dev Returns the amount of KWC owned by this contract
    function availableKWC() public view returns (uint) {
        return _KWCcontract.balanceOf(address(this));
    }
    
    /**
     * @dev Sends the value of the transaction to the owner of the contract
     * and returns the amount of KWC transfered to the caller. Fails if
     * the donation is too small or there is not enough KWC available
     */
    function donate() external payable returns (uint) {
        require(msg.value >= 1500000000000000, "Insufficient donation");
        uint numKWC = 0;
        if(msg.value >= 5000000000000000) numKWC = 5;
        else if (msg.value >= 2500000000000000) numKWC = 2;
        else numKWC = 1;
        
        require(availableKWC() >= numKWC * 10**DECIMALS, "Not enough KWC available");
        
        _KWCcontract.transfer(msg.sender, numKWC * 10**DECIMALS);
        sendToOwner();
        
        return numKWC;
    }
    
    receive() external payable {
        sendToOwner();
    }

    fallback() external payable {
        sendToOwner();
    }
    
    /// @dev Sends all the value of the transaction to the owner of the contract
    function sendToOwner() private {
        (bool sent, bytes memory data) = _owner.call{value: msg.value}("");
        require(sent, "Failed to send value");
    }
    
    /// @dev Allows execution only to the owner of the contract
    modifier onlyOwner() {
        require(_owner == msg.sender, "You don't have permission");
        _;
    }
    
    /**
     * @dev Wrapper struct for the leaks. Contains the timestamp of
     * the block, the info leaked and the published/unpublished state
     */
    struct Leak {
        string text;
        uint date;
        bool isPublic;
    }
    
    /// @dev Event used to notify about a new published leak
    event LeakPublished(bytes32);
    
    /// @dev Event used to notify about an unpublished leak
    event LeakUnpublished(bytes32);
}
