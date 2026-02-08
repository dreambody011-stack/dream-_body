
import React, { useState } from 'react';
import * as Storage from '../services/storage';
import { Lock, ArrowRight, AlertCircle, User, Instagram, PlusCircle, Activity, Mail, Phone, Users, Eye, EyeOff, Target, Calendar, Sparkles, Utensils } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (role: 'ADMIN' | 'CLIENT', userId?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regData, setRegData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    gender: 'MALE' as 'MALE' | 'FEMALE', dob: '', height: '', weight: '',
    fitnessGoal: 'Lose Fat', targetBody: '', weeklyWorkoutDays: 3,
    activityLevel: 'MODERATELY_ACTIVE' as UserType['activityLevel'],
    allergies: '', foodDislikes: '', forbiddenFoods: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = Storage.authenticate(identifier.trim(), password.trim());
    if (result) onLogin(result.role, result.user?.id);
    else setError('Invalid ID, Email, or Password.');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const newUser = Storage.createUser({
        ...regData,
        height: Number(regData.height),
        currentWeight: Number(regData.weight),
        weeklyWorkoutDays: Number(regData.weeklyWorkoutDays)
      });
      alert(`Account Created! Your Unique Login ID is: ${newUser.id}\n\nPlease keep this ID safe. Your plan will be generated once the Coach activates your subscription.`);
      onLogin('CLIENT', newUser.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className={`bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full ${isRegistering ? 'max-w-4xl' : 'max-w-md'} shadow-2xl transition-all`}>
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 mb-4">
              {isRegistering ? <PlusCircle className="h-8 w-8 text-cyan-500" /> : <Lock className="h-8 w-8 text-cyan-500" />}
           </div>
           <h2 className="text-2xl font-bold text-white">{isRegistering ? 'Dream Body Registration' : 'Client Access'}</h2>
           <p className="text-slate-500 text-sm mt-1">{isRegistering ? 'Enter your details to start your elite journey.' : 'Login with your ID, Email, or Phone.'}</p>
        </div>

        {error && <div className="flex items-center text-red-400 bg-red-900/20 p-3 rounded-lg text-sm mb-6"><AlertCircle className="h-4 w-4 mr-2" />{error}</div>}

        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
             <div>
               <label className="block text-xs text-slate-500 mb-1 ml-1">ID / EMAIL / PHONE</label>
               <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input required type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Username" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-cyan-500 outline-none" />
               </div>
             </div>
             <div>
               <label className="block text-xs text-slate-500 mb-1 ml-1">PASSWORD</label>
               <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-white focus:border-cyan-500 outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
               </div>
             </div>
             <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-900/40">Login <ArrowRight className="inline ml-2 h-5 w-5" /></button>
             <div className="text-center pt-4 text-sm text-slate-500">New client? <button type="button" onClick={() => setIsRegistering(true)} className="text-cyan-500 font-bold hover:underline">Apply for Membership</button></div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-bold border-b border-slate-800 pb-2 flex items-center"><User className="mr-2 h-4 w-4 text-cyan-500" /> Basic Info</h3>
              <input required type="text" placeholder="Full Name" value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              <input required type="email" placeholder="Email" value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              <input required type="tel" placeholder="Phone" value={regData.phone} onChange={(e) => setRegData({...regData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 ml-2">DOB</label>
                    <input required type="date" value={regData.dob} onChange={(e) => setRegData({...regData, dob: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 ml-2">GENDER</label>
                    <select value={regData.gender} onChange={(e) => setRegData({...regData, gender: e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                </div>
              </div>
              
              <h3 className="text-white font-bold border-b border-slate-800 pb-2 mt-4 flex items-center"><Target className="mr-2 h-4 w-4 text-cyan-500" /> Fitness Profile</h3>
              <select value={regData.fitnessGoal} onChange={(e) => setRegData({...regData, fitnessGoal: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500">
                <option value="Lose Fat">Lose Fat</option>
                <option value="Build Muscle">Build Muscle</option>
                <option value="Body Recomposition">Body Recomposition</option>
                <option value="Endurance">Endurance Training</option>
              </select>
              <input type="text" required placeholder="Describe your target body style..." value={regData.targetBody} onChange={(e) => setRegData({...regData, targetBody: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" placeholder="Height (cm)" value={regData.height} onChange={(e) => setRegData({...regData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
                <input required type="number" placeholder="Weight (kg)" value={regData.weight} onChange={(e) => setRegData({...regData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold border-b border-slate-800 pb-2 flex items-center"><Utensils className="mr-2 h-4 w-4 text-cyan-500" /> Nutrition Profile</h3>
              <input type="text" placeholder="Allergies (e.g. Nuts, Dairy)" value={regData.allergies} onChange={(e) => setRegData({...regData, allergies: e.target.value})} className="w-full bg-slate-950 border border-red-900/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500" />
              <input type="text" placeholder="Food Dislikes" value={regData.foodDislikes} onChange={(e) => setRegData({...regData, foodDislikes: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              <input type="text" placeholder="Forbidden Foods (Medical/Religious)" value={regData.forbiddenFoods} onChange={(e) => setRegData({...regData, forbiddenFoods: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              
              <h3 className="text-white font-bold border-b border-slate-800 pb-2 mt-4 flex items-center"><Lock className="mr-2 h-4 w-4 text-cyan-500" /> Security</h3>
              <input required type="password" placeholder="Create Password" value={regData.password} onChange={(e) => setRegData({...regData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              <input required type="password" placeholder="Confirm Password" value={regData.confirmPassword} onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" />
              
              <div className="pt-4 space-y-3">
                  <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01]">Start Transformation</button>
                  <button type="button" onClick={() => setIsRegistering(false)} className="w-full text-slate-500 text-sm py-2">Back to Login</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
