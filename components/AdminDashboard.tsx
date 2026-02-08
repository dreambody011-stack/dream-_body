
import React, { useState, useEffect, useRef } from 'react';
import { User, PricingPackage, PromoCode, AdminProfile, Offer, PaymentMethod } from '../types';
import * as Storage from '../services/storage';
import { generateStarterPlans } from '../services/geminiService';
import { 
  Users, Search, Edit, Trash2, Save, X, Settings, 
  Plus, Calendar, Activity, DollarSign, Tag, Key, Megaphone, CheckCircle, CreditCard, Bell, 
  Download, Upload, Database, BrainCircuit, Utensils
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'PACKAGES' | 'PROMOS' | 'OFFERS' | 'SETTINGS'>('USERS');
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [originalEditingId, setOriginalEditingId] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGeneratingPlans, setIsGeneratingPlans] = useState(false);

  // Data State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(Storage.getAppConfig().admin);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Promo Code Form
  const [newPromo, setNewPromo] = useState({ 
      code: '', discount: '', deadline: '', applicablePackageIds: [] as string[], maxUsage: 100 
  });
  
  // Offer Form
  const [newOffer, setNewOffer] = useState({ title: '', description: '', showLimit: 3 });

  // Import Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(Storage.getUsers());
    setAdminProfile(Storage.getAppConfig().admin);
    setPackages(Storage.getPackages());
    setPromoCodes(Storage.getPromoCodes());
    setOffers(Storage.getOffers());
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (user: User) => {
      setEditingUser({...user});
      setOriginalEditingId(user.id);
      setIsEditModalOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    if (editingUser.id !== originalEditingId) {
        // Storage helper for ID updates (not fully implemented in user's storage.ts, so we'll just update)
        Storage.updateUser(editingUser);
    } else {
        Storage.updateUser(editingUser);
    }
    
    setIsEditModalOpen(false);
    refreshData();
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Permanently delete this user?')) {
      const allUsers = Storage.getUsers().filter(u => u.id !== id);
      localStorage.setItem('db_fitness_users_v2', JSON.stringify(allUsers));
      refreshData();
    }
  };

  const handleActiveToggle = async (checked: boolean) => {
      if (!editingUser) return;
      let updated = { ...editingUser, isActive: checked };
      
      // Auto-generate plans if activating for the first time
      if (checked && (updated.workoutPlan.includes('Pending') || !updated.workoutPlan.trim())) {
          setIsGeneratingPlans(true);
          const plans = await generateStarterPlans(updated);
          updated.workoutPlan = plans.workout;
          updated.dietPlan = plans.diet;
          setIsGeneratingPlans(false);
      }
      setEditingUser(updated);
  };

  const approveRequest = async () => {
      if (!editingUser?.pendingRequest) return;
      const pkg = packages.find(p => p.id === editingUser.pendingRequest?.packageId);
      if (pkg) {
          const start = new Date();
          const end = new Date(start);
          end.setMonth(end.getMonth() + pkg.durationMonths);
          
          let updated = { 
              ...editingUser, 
              subscriptionStart: start.toISOString().split('T')[0],
              subscriptionEnd: end.toISOString().split('T')[0],
              isActive: true,
              payment: {
                  transactionId: editingUser.pendingRequest.transactionId,
                  method: editingUser.pendingRequest.method,
                  date: new Date().toISOString()
              },
              pendingRequest: undefined
          };

          if (updated.workoutPlan.includes('Pending') || !updated.workoutPlan.trim()) {
              setIsGeneratingPlans(true);
              const plans = await generateStarterPlans(updated);
              updated.workoutPlan = plans.workout;
              updated.dietPlan = plans.diet;
              setIsGeneratingPlans(false);
          }
          setEditingUser(updated);
      }
  };

  const handleExport = () => {
      const data = Storage.exportDatabase();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8">
        {[
            { id: 'USERS', icon: Users, label: 'Clients' },
            { id: 'PACKAGES', icon: DollarSign, label: 'Packages' },
            { id: 'PROMOS', icon: Tag, label: 'Promos' },
            { id: 'OFFERS', icon: Megaphone, label: 'Ads' },
            { id: 'SETTINGS', icon: Settings, label: 'Settings' }
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
            >
                <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
            </button>
        ))}
      </div>

      {activeTab === 'USERS' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Clients..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map(u => (
              <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{u.name}</h3>
                    <div className="text-sm text-cyan-400 font-mono">{u.id}</div>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                {u.pendingRequest && (
                    <div className="mb-4 bg-yellow-900/20 border border-yellow-500/30 p-2 rounded text-xs text-yellow-500 flex items-center">
                        <Bell className="h-3 w-3 mr-2" /> Pending Subscription Request
                    </div>
                )}
                <div className="flex space-x-2">
                  <button onClick={() => openEditModal(u)} className="flex-1 bg-slate-800 py-2 rounded-lg text-sm font-bold hover:bg-slate-700">Manage</button>
                  <button onClick={() => handleDeleteUser(u.id)} className="bg-slate-800 px-3 py-2 rounded-lg text-red-500 hover:bg-red-900/20"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
          <div className="max-w-xl space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center"><Key className="mr-2 text-cyan-500" /> Admin Credentials</h3>
                  <div className="space-y-4">
                      <input 
                        type="password" 
                        value={adminProfile.password} 
                        onChange={e => setAdminProfile({...adminProfile, password: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                        placeholder="New Password"
                      />
                      <button onClick={() => { Storage.updateAdminProfile(adminProfile); alert("Updated!"); }} className="w-full bg-cyan-600 py-2 rounded font-bold">Save Settings</button>
                  </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center"><Database className="mr-2 text-cyan-500" /> Maintenance</h3>
                  <button onClick={handleExport} className="w-full flex items-center justify-center bg-slate-800 py-3 rounded-xl border border-slate-700 hover:border-cyan-500 transition-all">
                      <Download className="mr-2" /> Export Database Backup
                  </button>
              </div>
          </div>
      )}

      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold flex items-center">
                    {editingUser.name}
                    {isGeneratingPlans && <span className="ml-4 text-xs animate-pulse text-cyan-400 bg-cyan-950 px-2 py-1 rounded">AI GENERATING PLANS...</span>}
                </h2>
                <button onClick={() => setIsEditModalOpen(false)}><X /></button>
            </div>
            
            {editingUser.pendingRequest && (
              <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-xl flex justify-between items-center">
                <div>
                    <div className="font-bold">Subscription Request: {editingUser.pendingRequest.packageName}</div>
                    <div className="text-sm text-slate-400">Trans ID: {editingUser.pendingRequest.transactionId}</div>
                </div>
                <button onClick={approveRequest} disabled={isGeneratingPlans} className="bg-yellow-600 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors">Approve & Generate AI Plans</button>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Activation</h3>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={editingUser.isActive} onChange={e => handleActiveToggle(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      <span className="ml-3 font-medium">Account Status: {editingUser.isActive ? 'Active' : 'Inactive'}</span>
                    </label>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Payment</h3>
                    <input 
                      placeholder="Transaction ID" 
                      value={editingUser.payment?.transactionId || ''} 
                      onChange={e => setEditingUser({...editingUser, payment: { ...editingUser.payment!, transactionId: e.target.value, method: editingUser.payment?.method || 'INSTAPAY', date: new Date().toISOString() }})} 
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" 
                    />
                  </div>
               </div>

               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center"><BrainCircuit className="mr-2 h-4 w-4" /> Customized Plans</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900 p-2 rounded">
                    <div><span className="text-slate-500">Goal:</span> {editingUser.fitnessGoal}</div>
                    <div><span className="text-slate-500">Allergies:</span> {editingUser.allergies || 'None'}</div>
                  </div>
                  <textarea rows={6} value={editingUser.workoutPlan} onChange={e => setEditingUser({...editingUser, workoutPlan: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-xs font-mono" placeholder="Workout Plan" />
                  <textarea rows={6} value={editingUser.dietPlan} onChange={e => setEditingUser({...editingUser, dietPlan: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-xs font-mono" placeholder="Diet Plan" />
               </div>

               <div className="flex gap-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-slate-800 py-3 rounded-xl font-bold">Cancel</button>
                  <button type="submit" disabled={isGeneratingPlans} className="flex-1 bg-cyan-600 py-3 rounded-xl font-bold flex justify-center items-center"><Save className="mr-2" /> Save Client Data</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
