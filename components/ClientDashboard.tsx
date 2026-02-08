
import React, { useState, useEffect } from 'react';
import { User, PricingPackage, PromoCode, Offer } from '../types';
import * as Storage from '../services/storage';
import { regenerateDietPlan } from '../services/geminiService';
import { 
  Download, Lock, Target, Utensils, 
  Dumbbell, MessageSquare, Instagram, Settings, UserCircle, Save,
  Megaphone, X, Ticket, CheckCircle, Clock, CreditCard, BrainCircuit, Activity
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import ChatInterface from './ChatInterface';

interface ClientDashboardProps {
  user: User;
  refreshUser: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, refreshUser }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'WORKOUT' | 'DIET' | 'AI' | 'PRICING' | 'PROFILE'>('HOME');
  const [newWeight, setNewWeight] = useState('');
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [currentAd, setCurrentAd] = useState<Offer | null>(null);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isRegeneratingDiet, setIsRegeneratingDiet] = useState(false);

  const [profileForm, setProfileForm] = useState({
      height: user.height || 0, weight: user.currentWeight || 0, gender: user.gender || 'MALE',
      fitnessGoal: user.fitnessGoal || 'General Fitness', targetBody: user.targetBody || '',
      weeklyWorkoutDays: user.weeklyWorkoutDays || 3, activityLevel: user.activityLevel || 'MODERATELY_ACTIVE',
      allergies: user.allergies || '', foodDislikes: user.foodDislikes || '', forbiddenFoods: user.forbiddenFoods || '',
      oldPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    const allOffers = Storage.getOffers().filter(o => o.isActive);
    setActiveOffers(allOffers);
    setPackages(Storage.getPackages());
    const userSeen = user.seenOffers || {};
    const adToShow = allOffers.find(offer => (userSeen[offer.id] || 0) < offer.showLimit);
    if (adToShow) setTimeout(() => setCurrentAd(adToShow), 1000);
  }, [user]);

  const isSubscriptionValid = user.isActive && (user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date()) && !!user.payment?.transactionId;
  const isLocked = !isSubscriptionValid;
  
  const handleRegenerateDiet = async () => {
      if(!confirm("Regenerate your diet based on current preferences? This overwrites your existing plan.")) return;
      setIsRegeneratingDiet(true);
      const newDiet = await regenerateDietPlan(user);
      Storage.updateUser({ ...user, dietPlan: newDiet });
      setIsRegeneratingDiet(false);
      refreshUser();
      alert("New Diet Plan Ready!");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
      e.preventDefault();
      let updatedUser = { 
        ...user, 
        ...profileForm,
        height: Number(profileForm.height), weight: Number(profileForm.weight),
        weeklyWorkoutDays: Number(profileForm.weeklyWorkoutDays)
      };
      if (profileForm.newPassword) {
          if (profileForm.oldPassword !== user.password) return alert("Incorrect password");
          if (profileForm.newPassword !== profileForm.confirmPassword) return alert("Mismatch");
          updatedUser.password = profileForm.newPassword;
      }
      Storage.updateUser(updatedUser);
      alert("Updated!");
      refreshUser();
  };

  const chartData = user.weightHistory.length > 0 ? user.weightHistory : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {activeOffers.length > 0 && (
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 mb-6 flex items-center overflow-hidden">
              <Megaphone className="h-5 w-5 text-cyan-400 mr-3 animate-pulse" />
              <div className="flex gap-8 text-sm text-cyan-100">
                  {activeOffers.map(o => <span key={o.id}>• {o.title}: {o.description}</span>)}
              </div>
          </div>
      )}

      {user.payment?.transactionId && (
        <div className="bg-slate-900/80 border-y border-slate-700 py-3 px-4 mb-6 flex flex-wrap gap-6 items-center text-sm rounded-lg">
             <CreditCard className="h-4 w-4 text-cyan-500" /><span className="font-bold">Payment Verified: {user.payment.method === 'MOBILE_WALLET' ? 'Wallet' : 'InstaPay'}</span>
             <span className="text-slate-500">ID: {user.payment.transactionId}</span>
        </div>
      )}

      <div className="mb-8 flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-white">Coach Hub: <span className="text-cyan-400">{user.name}</span></h1>
            <div className="flex items-center mt-2 text-slate-400 text-sm gap-4">
                <span className={`h-2 w-2 rounded-full ${!isLocked ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {!isLocked ? 'Active Subscription' : 'Membership Expired/Unverified'}
            </div>
         </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-slate-800">
        {[
          { id: 'HOME', icon: Target, label: 'Progress' },
          { id: 'WORKOUT', icon: Dumbbell, label: 'Workout' },
          { id: 'DIET', icon: Utensils, label: 'Nutrition' },
          { id: 'AI', icon: MessageSquare, label: 'Elite AI' },
          { id: 'PRICING', icon: Ticket, label: 'Membership' },
          { id: 'PROFILE', icon: Settings, label: 'Settings' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center px-6 py-3 rounded-t-lg font-medium ${activeTab === t.id ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500'}`}><t.icon className="mr-2 h-4 w-4" />{t.label}</button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'HOME' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800"><div className="text-slate-500 text-xs">Weight</div><div className="text-2xl font-bold text-white">{user.currentWeight}kg</div></div>
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800"><div className="text-slate-500 text-xs">Goal</div><div className="text-lg font-bold text-cyan-400">{user.fitnessGoal}</div></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}><CartesianGrid stroke="#1e293b" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={3} /></LineChart>
                 </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeTab === 'WORKOUT' || activeTab === 'DIET') && (
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
             {isLocked && <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl"><Lock className="h-16 w-16 text-red-500 mb-4" /><h2 className="text-xl font-bold text-white">Subscription Locked</h2></div>}
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{activeTab} PLAN</h2>
                {activeTab === 'DIET' && <button onClick={handleRegenerateDiet} disabled={isLocked || isRegeneratingDiet} className="flex items-center bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-lg text-sm border border-cyan-500/50"><BrainCircuit className="mr-2 h-4 w-4" />{isRegeneratingDiet ? 'Regenerating...' : 'Regenerate Diet with AI'}</button>}
             </div>
             <div className="whitespace-pre-wrap font-mono text-sm text-slate-300">{activeTab === 'WORKOUT' ? user.workoutPlan : user.dietPlan}</div>
          </div>
        )}

        {activeTab === 'AI' && <ChatInterface user={user} />}

        {activeTab === 'PROFILE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><UserCircle className="mr-2 h-6 w-6 text-cyan-500" /> Account Settings</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500">Goal</label><select value={profileForm.fitnessGoal} onChange={e => setProfileForm({...profileForm, fitnessGoal: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"><option value="Lose Fat">Lose Fat</option><option value="Build Muscle">Build Muscle</option></select></div>
                <div><label className="text-xs text-slate-500">Target Aesthetic</label><input value={profileForm.targetBody} onChange={e => setProfileForm({...profileForm, targetBody: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" /></div>
              </div>
              <div className="space-y-4">
                <div><label className="text-xs text-red-400">Allergies (Danger)</label><input value={profileForm.allergies} onChange={e => setProfileForm({...profileForm, allergies: e.target.value})} className="w-full bg-slate-950 border border-red-900/40 rounded p-2 text-white" placeholder="Peanuts, Shellfish..." /></div>
                <div><label className="text-xs text-slate-500">Food Dislikes</label><input value={profileForm.foodDislikes} onChange={e => setProfileForm({...profileForm, foodDislikes: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Broccoli, Liver..." /></div>
                <div><label className="text-xs text-slate-500">Forbidden Foods</label><input value={profileForm.forbiddenFoods} onChange={e => setProfileForm({...profileForm, forbiddenFoods: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Pork, Alcohol..." /></div>
              </div>
              <div className="flex justify-end"><button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-lg font-bold flex items-center"><Save className="mr-2 h-4 w-4" /> Save Preferences</button></div>
            </form>
          </div>
        )}

        {activeTab === 'PRICING' && (
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-cyan-400 mb-6">{pkg.price} EGY</div>
                <button 
                  onClick={() => {
                    // Fix: Add required transactionId and method to meet PendingRequest type requirements
                    Storage.updateUser({
                      ...user, 
                      pendingRequest: { 
                        packageId: pkg.id, 
                        packageName: pkg.name, 
                        requestedPrice: pkg.price, 
                        requestDate: new Date().toISOString(),
                        transactionId: 'PENDING',
                        method: 'INSTAPAY'
                      }
                    });
                    window.open("https://www.instagram.com/dreambody997?igsh=MWVvenQ1MzF6eHUyYQ==", "_blank");
                    refreshUser();
                  }}
                  className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold text-sm"
                >
                  Pay via InstaPay / Wallet
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
