// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";
import "./NFT.sol";

contract Market is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;
  NFT tokenContract;

  struct MarketItem {
    uint256 itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
    bool verified;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  uint256 private allUnsoldItemsCount;
  uint256 private latestItemId;

  mapping(address => string) private authorToProfile;

  constructor() {
    owner = payable(msg.sender);
  }

  function addItemToMarketplace(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public nonReentrant {
    require(price > 0, "Price must be at least 1 wei");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    latestItemId = itemId;

    idToMarketItem[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)), // empty address because no one owns it at listing
      price,
      false,
      false
    );

    // transfer ownership
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  function sellItemAndTransferOwnership(address nftContract, uint256 itemId)
  public
  payable
  nonReentrant
  {
    uint256 price = idToMarketItem[itemId].price;
    uint256 tokenId = idToMarketItem[itemId].tokenId;

    require(
      msg.value == price,
      "Please submit the asking price in order to complete the purchase"
    );

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
  }

  function getAllUnsoldItems() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint256 currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint256 currentId = i + 1;
        // TODO remove file to unlock
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function getPurchasedItemsBySender()
  public
  view
  returns (MarketItem[] memory)
  {
    return getItemsByOwnerOrSeller(true);
  }

  function getCreatedItemsBySender()
  public
  view
  returns (MarketItem[] memory)
  {
    return getItemsByOwnerOrSeller(false);
  }

  function getItemsByOwnerOrSeller(bool isOwner)
  internal
  view
  returns (MarketItem[] memory)
  {
    uint256 totalItemCount = _itemIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      address matchingAddress = getMatchingAddress(isOwner, i + 1);
      if (matchingAddress == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      address matchingAddress = getMatchingAddress(isOwner, i + 1);
      if (matchingAddress == msg.sender) {
        uint256 currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items;
  }

  function getMatchingAddress(bool isOwner, uint256 index)
  internal
  view
  returns (address)
  {
    address matchingAddress;
    if (isOwner) {
      matchingAddress = idToMarketItem[index].owner;
    } else {
      matchingAddress = idToMarketItem[index].seller;
    }

    return matchingAddress;
  }

  function getLatestItem() external view returns(MarketItem memory) {
    return idToMarketItem[latestItemId];
  }
}
