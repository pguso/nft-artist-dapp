export interface Item {
  itemId: number;
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
  externalLink?: string;
  sold: boolean;
  isRare: boolean;
  isAuction: boolean;
  lastBidder: string;
  collectionId: number;
}
