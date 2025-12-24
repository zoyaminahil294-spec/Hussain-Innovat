import React, { useState } from 'react';
import { Product } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  product: Product | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, siteName, product }) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = product 
    ? `${window.location.origin}?product=${product.id}&p=${product.price}` 
    : window.location.origin;

  const shareText = product 
    ? `Check out ${product.name} at Hussain Innovat! Only Rs. ${product.price.toLocaleString()}.`
    : `Explore Hussain Innovat - Your premium tech & fashion destination!`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: 'WhatsApp', color: 'bg-[#25D366]', href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
    { name: 'Facebook', color: 'bg-[#1877F2]', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Share Hussain Innovat</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {shareOptions.map((option) => (
              <a key={option.name} href={option.href} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-3 p-4 rounded-3xl ${option.color} text-white hover:scale-105 transition-transform`}>
                <span className="text-[10px] font-black uppercase tracking-widest">{option.name}</span>
              </a>
            ))}
          </div>
          <button onClick={handleCopyLink} className={`w-full py-4 rounded-2xl border-2 transition-all font-bold ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            {copied ? 'Link Copied!' : 'Copy Site Link'}
          </button>
      </div>
    </div>
  );
};

export default ShareModal;