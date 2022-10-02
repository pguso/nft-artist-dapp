// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";
import "./NFT.sol";
import "./Auction.sol";

contract Market is ReentrancyGuard, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

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
    bool isRare;
    bool isAuction;
    address payable lastBidder;
    uint collectionId;
  }

  mapping(uint256 => Auction) _auctions;
  string[] _collections;

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool isRare,
    bool isAuction,
    address payable lastBidder
  );

  uint256 private allUnsoldItemsCount;
  uint256 private latestItemId;

  mapping(address => string) private authorToProfile;

  constructor(string[] memory collections) {
    for (uint i = 0; i < collections.length; i++) {
      _collections.push(collections[i]);
    }
  }

  function addItemToMarketplace(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    bool isRare,
    bool isAuction,
    uint duration,
    uint256 collectionId
  ) external nonReentrant onlyOwner {
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
      false,
      isRare,
      isAuction,
      payable(0),
      collectionId
    );

    if (isAuction) {
      _auctions[itemId] = new Auction();
      _auctions[itemId].start(
        duration,
        price
      );
    }

    // transfer ownership
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false,
      isRare,
      isAuction,
      payable(0)
    );
  }

  function bidOnAuction(uint256 itemId) external payable {
    require(idToMarketItem[itemId].isAuction, "This item has no attached auction");

    address highestBidder = _auctions[itemId].getHighestBidder();
    uint256 highestBid = _auctions[itemId].getHighestBid();

    if (highestBidder != address(0)) {
      payable(highestBidder).transfer(highestBid);
    }

    _auctions[itemId].bid(msg.sender, msg.value);
    idToMarketItem[itemId].price = msg.value;
  }

  function endAuctionAndTransferOwnership(address nftContract, uint itemId) external nonReentrant {
    uint256 price = idToMarketItem[itemId].price;
    uint256 tokenId = idToMarketItem[itemId].tokenId;

    _auctions[itemId].end();

    address highestBidder = _auctions[itemId].getHighestBidder();
    if (highestBidder != address(0)) {
      payable(idToMarketItem[itemId].seller).transfer(price);
      IERC721(nftContract).transferFrom(address(this), highestBidder, tokenId);
      idToMarketItem[itemId].owner = payable(highestBidder);
      idToMarketItem[itemId].sold = true;
      _itemsSold.increment();
    }
  }

  function sellItemAndTransferOwnership(address nftContract, uint256 itemId)
  external
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

  function getAuctionEndTimestamp(uint itemId) external view returns(uint256) {
    return _auctions[itemId].endAt();
  }

  function getAuctionBids(uint itemId) external view returns(Auction.TrackBid[] memory) {
    return _auctions[itemId].getAllBids();
  }

  function getAllUnsoldItems() external view returns (MarketItem[] memory) {
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

  function getOnlyRareItems() external view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint256 currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0) && idToMarketItem[i + 1].isRare) {
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
  external
  view
  returns (MarketItem[] memory)
  {
    return getItemsByOwnerOrSeller(true);
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

  function getLatestItem() external view returns (MarketItem memory) {
    return idToMarketItem[latestItemId];
  }

  function getItemById(uint itemId) external view returns (MarketItem memory) {
    return idToMarketItem[itemId];
  }

  function getCollections() external view returns(string[] memory) {
    return _collections;
  }

  function getCollectionById(uint id) external view returns(string memory) {
    return _collections[id];
  }
}
