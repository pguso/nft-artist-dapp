// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract Auction {
  event Start();
  event End(
    address highestBidder,
    uint highestBid
  );
  event Bid(
    address indexed sender,
    uint amount
  );

  address payable public marketContract;

  bool public isStarted;
  bool public isEnded;
  uint public endAt;

  uint public highestBid;
  address public highestBidder;
  mapping(address => uint[]) public bidsByBidder;

  struct TrackBid {
    uint timestamp;
    address bidder;
    uint bid;
  }

  TrackBid[] public trackedBids;

  modifier onlyMarketContract() {
    require(msg.sender == marketContract, "You need to use the market contract");
    _;
  }

  constructor() {
    marketContract = payable(msg.sender);
  }

  function start(uint duration, uint startingBid) public onlyMarketContract {
    require(!isStarted, "The auction is already started.");
    require(msg.sender == marketContract, "Only the seller can start the auction.");

    TrackBid memory trackBid = TrackBid(block.timestamp, address(0), startingBid);
    trackedBids.push(trackBid);

    isStarted = true;
    // endAt = block.timestamp + duration * 1 days;
    endAt = block.timestamp + duration * 1 seconds;
    highestBid = startingBid;

    emit Start();
  }

  function bid(address actualBidder, uint actualBid) public onlyMarketContract {
    require(isStarted, "Auction was not started yet.");
    require(block.timestamp < endAt, "Auction already ended.");
    require(actualBid > highestBid, "Bid must higher then the latest bid.");

    highestBid = actualBid;
    highestBidder = actualBidder;
    bidsByBidder[highestBidder].push(highestBid);

    TrackBid memory trackBid = TrackBid(block.timestamp, actualBidder, highestBid);
    trackedBids.push(trackBid);

    emit Bid(highestBidder, highestBid);
  }

  function end() public onlyMarketContract {
    require(isStarted, "You need to start the auction first");
    require(block.timestamp >= endAt, "Auction is still ongoing");
    require(!isEnded, "Auction is already ended");

    isEnded = true;

    emit End(highestBidder, highestBid);
  }

  function getHighestBidder() public view returns (address) {
    return highestBidder;
  }

  function getHighestBid() public view returns (uint256) {
    return highestBid;
  }

  function getAllBids() public view returns (TrackBid[] memory) {
    return trackedBids;
  }

  function getBidsByBidder(address bidder) public view returns (uint[] memory) {
    return bidsByBidder[bidder];
  }
}
