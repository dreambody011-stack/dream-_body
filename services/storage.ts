
import { User, PricingPackage, AppConfig, PromoCode, AdminProfile, Offer } from '../types';

const KEYS = {
  USERS: 'db_fitness_users_v2',
  PACKAGES: 'db_fitness_packages_v2',
  PROMOS: 'db_fitness_promos_v2',
  OFFERS: 'db_fitness_offers_v2',
  CONFIG: 'db_fitness_config_v2',
  SESSION: 'db_fitness_session_v2',
};

const DEFAULT_PACKAGES: PricingPackage[] = [
  { id: '1', name: 'Elite Monthly', price: '500', durationMonths: 1, features: ['AI Nutrition', 'AI Training', 'Daily Support'] },
  { id: '2', name: 'Championship 3-Month', price: '1200', durationMonths: 3, features: ['Priority Support', 'Video Review', 'Bulk Discount'] },
];

const DEFAULT_ADMIN: AdminProfile = {
  id: 'SO3DA2007',
  email: 'admin@dreambody.com',
  phone: '0000000000',
  password: 'Ahly2007.com'
};

const generateId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const initStorage = () => {
  if (!localStorage.getItem(KEYS.PACKAGES)) localStorage.setItem(KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
  if (!localStorage.getItem(KEYS.CONFIG)) localStorage.setItem(KEYS.CONFIG, JSON.stringify({ admin: DEFAULT_ADMIN }));
  if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.PROMOS)) localStorage.setItem(KEYS.PROMOS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.OFFERS)) localStorage.setItem(KEYS.OFFERS, JSON.stringify([]));
};

export const getUsers = (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
export const getUser = (id: string): User | undefined => getUsers().find(u => u.id === id);

export const createUser = (data: Partial<User>): User => {
  const users = getUsers();
  const id = generateId();
  const newUser: User = {
    id,
    password: data.password || generateId(),
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    gender: data.gender || 'MALE',
    dob: data.dob || '',
    createdAt: new Date().toISOString(),
    height: data.height || 0,
    currentWeight: data.currentWeight || 0,
    weightHistory: [],
    fitnessGoal: data.fitnessGoal || '',
    targetBody: data.targetBody || '',
    weeklyWorkoutDays: data.weeklyWorkoutDays || 3,
    activityLevel: data.activityLevel || 'MODERATELY_ACTIVE',
    allergies: data.allergies || '',
    foodDislikes: data.foodDislikes || '',
    forbiddenFoods: data.forbiddenFoods || '',
    isActive: false,
    workoutPlan: 'Pending activation...',
    dietPlan: 'Pending activation...',
    notes: '',
    planHistory: [],
    subscriptionHistory: [],
    promoUsage: {},
    seenOffers: {},
  };
  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

export const getPromoCodes = (): PromoCode[] => JSON.parse(localStorage.getItem(KEYS.PROMOS) || '[]');
export const savePromoCode = (code: PromoCode) => {
  const codes = getPromoCodes();
  codes.push(code);
  localStorage.setItem(KEYS.PROMOS, JSON.stringify(codes));
};

export const deletePromoCode = (id: string) => {
  const codes = getPromoCodes().filter(c => c.id !== id);
  localStorage.setItem(KEYS.PROMOS, JSON.stringify(codes));
};

export const getAppConfig = (): AppConfig => JSON.parse(localStorage.getItem(KEYS.CONFIG) || '{}');
export const getPackages = (): PricingPackage[] => JSON.parse(localStorage.getItem(KEYS.PACKAGES) || '[]');
export const getOffers = (): Offer[] => JSON.parse(localStorage.getItem(KEYS.OFFERS) || '[]');

export const setSession = (type: 'ADMIN' | 'CLIENT', userId?: string) => localStorage.setItem(KEYS.SESSION, JSON.stringify({ type, userId }));
export const getSession = () => JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null');
export const clearSession = () => localStorage.removeItem(KEYS.SESSION);

// Fix: Added explicit return type to resolve type mismatch in Login component
export const authenticate = (identifier: string, password: string): { role: 'ADMIN' | 'CLIENT', user?: User } | null => {
  const config = getAppConfig();
  const users = getUsers();
  if (config.admin.id === identifier || (config.admin.email === identifier && config.admin.password === password)) return { role: 'ADMIN' };
  const user = users.find(u => (u.id === identifier || u.email === identifier || u.phone === identifier) && u.password === password);
  return user ? { role: 'CLIENT', user } : null;
};

// Fix: Implemented missing updateAdminProfile function for settings management
export const updateAdminProfile = (admin: AdminProfile) => {
  const config = getAppConfig();
  config.admin = admin;
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
};

// Fix: Implemented missing exportDatabase function for data backups
export const exportDatabase = (): string => {
  const data: Record<string, string | null> = {};
  Object.entries(KEYS).forEach(([key, storageKey]) => {
    data[key] = localStorage.getItem(storageKey);
  });
  return JSON.stringify(data);
};
