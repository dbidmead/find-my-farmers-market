export interface FarmersMarket {
  id: string;
  marketname?: string;
  MarketName?: string;
  website?: string;
  Website?: string;
  street?: string;
  Address?: string;
  city?: string;
  City?: string;
  county?: string;
  County?: string;
  state?: string;
  State?: string;
  zip?: string;
  Zip?: string;
  lat?: number;
  lon?: number;
  Latitude?: number;
  Longitude?: number;
  distance?: number;
  Schedule?: string;
  Products?: string;
  season1date?: string;
  season1time?: string;
  season2date?: string;
  season2time?: string;
  season3date?: string;
  season3time?: string;
  season4date?: string;
  season4time?: string;
  credit?: string;
  wic?: string;
  wiccash?: string;
  sfmnp?: string;
  snap?: string;
  organic?: string;
  bakedgoods?: string;
  cheese?: string;
  crafts?: string;
  flowers?: string;
  eggs?: string;
  seafood?: string;
  herbs?: string;
  vegetables?: string;
  honey?: string;
  jams?: string;
  maple?: string;
  meat?: string;
  nuts?: string;
  plants?: string;
  poultry?: string;
  prepared?: string;
  soap?: string;
  trees?: string;
  wine?: string;
  updateTime?: string;
}

export interface SearchParams {
  lat?: number;
  lng?: number;
  zip?: string;
  radius?: number;
}

export interface ApiResponse {
  results: FarmersMarket[];
  count: number;
}

// Additional interface for the actual API response structure
export interface USDAMarketListItem {
  id: string;
  marketname: string;
  distance?: number;
} 