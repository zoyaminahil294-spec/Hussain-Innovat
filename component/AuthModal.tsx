import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

// Hussain bhai, ye apka admin login hai
const ADMIN_EMAIL = 'hussain@innovat.com';
const ADMIN_PASS = 'hussain123';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const adminUser: User = { 
        id: 'admin-hussain', 
        name: 'Hussain Admin', 
        email: ADMIN_EMAIL, 
        joinedAt: Date.now(), 
        balance: 0, 
        role: 'admin' 
      };
      onAuthSuccess(adminUser);
      onClose();
    } else {
      alert("Ghalat password! Sirf Hussain bhai hi login kar sakte hain.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Owner Login</h2>
        <p className="text-slate-400 text-sm mb-10 font-bold uppercase tracking-widest">Verify identity for Hussain Innovat</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Admin Email</label>
            <input type="email" required placeholder="hussain@innovat.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-600 transition-all font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-600 transition-all font-bold" />
          </div>
          <button type="submit" className="w-full bg-slate-950 text-white font-black py-6 rounded-[2rem] shadow-xl hover:bg-indigo-600 transition-all uppercase tracking-widest text-[10px]">Access Dashboard</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;