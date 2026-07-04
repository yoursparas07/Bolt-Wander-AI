export type Category = 'heritage' | 'food' | 'art' | 'nightlife' | 'nature';
export type ExperienceType = 'authentic' | 'mainstream' | 'mixed';
export type Budget = 'free' | 'budget' | 'mid' | 'premium';
export type TimeAvailable = 'hour' | 'halfday' | 'fullday' | 'weekend';
export type Region = 'asia' | 'europe' | 'africa-middle-east' | 'americas';

export interface Destination {
  id: string;
  name: string;
  location: string;
  country: string;
  region: Region;
  categories: Category[];
  experienceType: ExperienceType;
  budgetLevel: Budget;
  timeRequired: TimeAvailable;
  headline: string;
  story: string;
  localTip: string;
  shareCaption: string;
  storyBlurb: string;
  image: string;
  localBusiness?: string;
  localBusinessType?: string;
  coordinates?: { lat: number; lng: number };
  tags: string[];
  bestFor: string;
  hidden: boolean;
}

export interface FilterCriteria {
  category: Category | 'all';
  experienceType: ExperienceType | 'all';
  budget: Budget | 'all';
  time: TimeAvailable | 'all';
  region: Region | 'all';
}

export interface RecommendationResult {
  destination: Destination;
  score: number;
  matchReasons: string[];
}
