// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DigitalAssetVault
 * @dev Manages digital asset metadata (IPFS CIDs) and lifecycle states on Ethereum.
 */
contract DigitalAssetVault is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant NOMINEE_ROLE = keccak256("NOMINEE_ROLE");

    enum AssetState { Uploaded, Verified, Released }

    struct Asset {
        string ipfsCid;
        address owner;
        address nominee;
        AssetState state;
        uint256 timestamp;
    }

    // Mapping from Asset UUID (as string) to Asset metadata
    mapping(string => Asset) public assets;

    event AssetUploaded(string indexed assetId, string ipfsCid, address indexed owner);
    event AssetVerified(string indexed assetId);
    event AssetReleased(string indexed assetId, address indexed nominee);

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(ADMIN_ROLE, initialAdmin);
    }

    /**
     * @dev Register a new asset with its IPFS CID.
     */
    function uploadAsset(
        string memory assetId,
        string memory ipfsCid,
        address nominee
    ) public {
        require(bytes(assets[assetId].ipfsCid).length == 0, "Asset already exists");
        
        assets[assetId] = Asset({
            ipfsCid: ipfsCid,
            owner: msg.sender,
            nominee: nominee,
            state: AssetState.Uploaded,
            timestamp: block.timestamp
        });

        _grantRole(USER_ROLE, msg.sender);
        _grantRole(NOMINEE_ROLE, nominee);

        emit AssetUploaded(assetId, ipfsCid, msg.sender);
    }

    /**
     * @dev Admin verifies the asset (e.g., after manual check).
     */
    function verifyAsset(string memory assetId) public onlyRole(ADMIN_ROLE) {
        Asset storage asset = assets[assetId];
        require(asset.state == AssetState.Uploaded, "Invalid state transition");
        
        asset.state = AssetState.Verified;
        emit AssetVerified(assetId);
    }

    /**
     * @dev Release asset to the nominee. Can be triggered by Admin or verified logic.
     */
    function releaseAsset(string memory assetId) public {
        Asset storage asset = assets[assetId];
        require(asset.state == AssetState.Verified, "Asset must be verified first");
        require(hasRole(ADMIN_ROLE, msg.sender) || msg.sender == asset.owner, "Unauthorized");

        asset.state = AssetState.Released;
        emit AssetReleased(assetId, asset.nominee);
    }

    /**
     * @dev Get asset details.
     */
    function getAsset(string memory assetId) public view returns (
        string memory ipfsCid,
        address owner,
        address nominee,
        AssetState state,
        uint256 timestamp
    ) {
        Asset memory asset = assets[assetId];
        return (asset.ipfsCid, asset.owner, asset.nominee, asset.state, asset.timestamp);
    }
}
