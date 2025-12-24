
import React, { useState } from 'react';
import { CartItem, Order } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  deliveryFee: number;
}

type CheckoutStep = 'CART' | 'SHIPPING' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS';

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi', 
  'Multan', 'Gujranwala', 'Hyderabad', 'Peshawar', 'Quetta', 
  'Sargodha', 'Sialkot', 'Bahawalpur', 'Sukkur', 'Jhang'
];

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onPlaceOrder, deliveryFee }) => {
  const [step, setStep] = useState<CheckoutStep>('CART');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(PAKISTAN_CITIES[0]);
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharges = items.length > 0 ? deliveryFee : 0;
  const total = subtotal + deliveryCharges;

  if (!isOpen) return null;

  const handleGoToShipping = () => setStep('SHIPPING');
  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PAYMENT');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PROCESSING');
    
    // Simulate payment logic
    setTimeout(() => {
      onPlaceOrder({
        items: [...items],
        subtotal,
        deliveryCharges,
        total,
        customerMobile: mobileNumber,
        customerAddress: address,
        customerCity: city,
      });
      setStep('SUCCESS');
    }, 2000);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello Hussain Innovat! I want to order:\n${items.map(i => `- ${i.name} x${i.quantity} (Rs. ${i.price})`).join('\n')}\nTotal: Rs. ${total}\nMy Address: ${address}, ${city}\nContact: ${mobileNumber}`;
    window.open(`https://wa.me/923000000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const resetCart = () => {
    setStep('CART');
    onClose();
    setMobileNumber('');
    setAddress('');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
            {step === 'CART' && 'Your Bag'}
            {step === 'SHIPPING' && 'Delivery Info'}
            {step === 'PAYMENT' && 'Checkout'}
            {step === 'PROCESSING' && 'Confirming...'}
            {step === 'SUCCESS' && 'Order Placed!'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 'CART' && (
            <div className="space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">🛒</div>
                  <p className="font-bold uppercase tracking-widest text-[10px]">Your Bag is Empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-5 p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                    <img src={item.images?.[0]} className="w-20 h-20 object-cover rounded-2xl bg-slate-50 border border-slate-100" />
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{item.name}</h3>
                      <p className="text-indigo-600 font-black text-xs mt-1">Rs. {item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-lg text-slate-400 font-bold hover:text-indigo-600 transition-colors">-</button>
                        <span className="text-sm font-black text-slate-900">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-lg text-slate-400 font-bold hover:text-indigo-600 transition-colors">+</button>
                        <button onClick={() => onRemove(item.id)} className="ml-auto text-[10px] font-black text-red-400 uppercase tracking-widest">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {step === 'SHIPPING' && (
            <form onSubmit={handleGoToPayment} className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select City</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-indigo-600 transition-colors">
                  {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Address</label>
                <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House No, Street, Area..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 h-32 outline-none font-bold focus:border-indigo-600 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-600 transition-colors uppercase tracking-widest text-[10px]">Continue</button>
            </form>
          )}
          {step === 'PAYMENT' && (
            <div className="space-y-6 py-4">
              <div className="bg-[#1ab394] p-8 rounded-[2.5rem] text-white shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Payable via</p>
                <p className="text-4xl font-black italic">Easypaisa / JazzCash</p>
                <p className="text-2xl font-black mt-6">Rs. {total.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Account Number</label>
                <input type="tel" required placeholder="03XX XXXXXXX" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 font-black outline-none focus:border-[#1ab394] transition-colors" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={handlePayment} className="w-full bg-[#1ab394] text-white font-black py-5 rounded-2xl shadow-xl hover:opacity-90 transition-all uppercase tracking-widest text-[10px]">Confirm Order</button>
                <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                  Confirm on WhatsApp
                </button>
              </div>
            </div>
          )}
          {step === 'SUCCESS' && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 text-4xl animate-bounce">✓</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Order Confirmed!</h3>
              <p className="text-slate-500 text-sm mb-12 px-8 font-medium leading-relaxed">Thank you for shopping at Hussain Innovat. Your premium product will be shipped within 48 hours.</p>
              <button onClick={resetCart} className="bg-slate-950 text-white font-black px-12 py-5 rounded-2xl shadow-xl uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-colors">Back to Store</button>
            </div>
          )}
        </div>
        {(step === 'CART' || step === 'SHIPPING') && (
          <div className="p-8 border-t border-slate-100 bg-slate-50/50">
            <div className="space-y-3 mb-8">
               <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Delivery</span>
                  <span>Rs. {deliveryCharges.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Total</span>
                <span className="text-2xl font-black text-slate-900">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            {step === 'CART' && (
              <button onClick={handleGoToShipping} disabled={items.length === 0} className="w-full bg-slate-950 text-white font-black py-6 rounded-[2rem] shadow-2xl disabled:opacity-50 tracking-[0.2em] text-[10px] uppercase hover:bg-indigo-600 transition-colors active:scale-95">Checkout Now</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
