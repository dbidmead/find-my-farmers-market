export interface FarmersMarket {
  id: string;
  marketname: string;
  website?: string;
  street?: string;
  city?: string;
  county?: string;
  state?: string;
  zip?: string;
  lat?: number;
  lon?: number;
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