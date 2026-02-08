
export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  durationMonths: number;
  features: string[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discountValue: string; // e.g., "10%" or "100"
  discountType: 'PERCENTAGE' | 'FIXED';
  deadline: string;
  maxUsageTotal: number | 'unlimited';
  maxUsagePerUser: number;
  currentUsageCount: number;
}

// Added missing Offer interface used for advertisements/announcements
export interface Offer {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  showLimit: number;
}

export interface PlanHistoryEntry {
  id: string;
  date: string;
  type: 'WORKOUT' | 'DIET';
  content: string;
}

export interface SubscriptionHistoryEntry {
  id: string;
  packageName: string;
  amount: string;
  transactionId: string;
  method: PaymentMethod;
  date: string;
  promoCode?: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED';
}

export type PaymentMethod = 'INSTAPAY' | 'MOBILE_WALLET';

export interface PaymentDetails {
  transactionId: string;
  method: PaymentMethod;
  date: string;
}

export interface PendingRequest {
  packageId: string;
  packageName: string;
  requestedPrice: string;
  promoCodeUsed?: string;
  requestDate: string;
  transactionId: string;
  method: PaymentMethod;
}

export interface User {
  id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  dob: string;
  createdAt: string;
  
  // Physical Stats
  height: number;
  currentWeight: number;
  weightHistory: WeightEntry[];
  
  // Fitness Profile
  fitnessGoal: string; 
  targetBody: string; 
  weeklyWorkoutDays: number; 
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE';

  // Dietary Profile
  allergies: string; 
  foodDislikes: string; 
  forbiddenFoods: string; 

  // Subscription
  subscriptionStart?: string;
  subscriptionEnd?: string;
  isActive: boolean;
  
  // Payment & Request
  payment?: PaymentDetails;
  pendingRequest?: PendingRequest;

  // Plans
  workoutPlan: string;
  dietPlan: string;
  notes: string;

  // History for Admin
  planHistory: PlanHistoryEntry[];
  subscriptionHistory: SubscriptionHistoryEntry[];

  // Promo Usage tracking (code -> count)
  promoUsage: Record<string, number>;

  // Ads
  seenOffers: Record<string, number>;
}

export interface AdminProfile {
  id: string;
  email: string;
  phone: string;
  password: string;
}

export interface AppConfig {
  admin: AdminProfile;
}

export type ViewState = 'PUBLIC' | 'LOGIN' | 'ADMIN' | 'CLIENT';
