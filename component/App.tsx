
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, ViewMode, User } from './types';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';
import ImageModal from './components/ImageModal';
import AuthModal from './components/AuthModal';
import ShareModal from './components/ShareModal';

const App: React.FC = () => {
  const STORAGE_KEY_PREFIX = 'hussain-innovat-v1';

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-products`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-orders`);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewMode>(ViewMode.STOREFRONT);
  const [adminSubTab, setAdminSubTab] = useState<'inventory' | 'orders' | 'deployment'>('inventory');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-products`, JSON.stringify(products));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-cart`, JSON.stringify(cart));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-orders`, JSON.stringify(orders));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-user`, JSON.stringify(currentUser));
  }, [products, cart, orders, currentUser]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      status: 'Pending',
      createdAt: Date.now(),
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      <Navbar 
        view={view} setView={setView} 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} 
        onCartToggle={() => setIsCartOpen(true)}
        onShareToggle={() => setIsShareOpen(true)} 
        currentUser={currentUser}
        onLogout={() => { setCurrentUser(null); setView(ViewMode.STOREFRONT); }}
        onAuthToggle={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 pt-24 pb-20">
        {view === ViewMode.ADMIN && currentUser ? (
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
               <div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Admin Hub</h1>
                 <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Hussain Innovat Control Center</p>
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                 <button onClick={() => setAdminSubTab('inventory')} className={`flex-none px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${adminSubTab === 'inventory' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Stock</button>
                 <button onClick={() => setAdminSubTab('orders')} className={`flex-none px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${adminSubTab === 'orders' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Orders ({orders.length})</button>
                 <button onClick={() => setAdminSubTab('deployment')} className={`flex-none px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${adminSubTab === 'deployment' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Settings</button>
               </div>
            </div>

            {adminSubTab === 'inventory' && (
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                  <ProductForm onAdd={(p) => setProducts([p, ...products])} currentUser={currentUser} />
                </div>
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm p-8">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-8">Your Products ({products.length})</h3>
                    <div className="space-y-4">
                      {products.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                              <span className="text-[10px] font-black text-indigo-600">PKR {p.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="text-red-500 font-black text-[10px] uppercase px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                        </div>
                      ))}
                      {products.length === 0 && (
                        <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[2rem]">
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hussain bhai, add your first product to start selling!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminSubTab === 'orders' && (
              <div className="bg-white p-8 md:p-20 rounded-[3rem] border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Recent Orders</h3>
                <div className="max-w-3xl mx-auto space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-xs">{order.id}</span>
                        <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase">{order.status}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8 text-sm">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Info</p>
                          <p className="font-bold text-slate-800">{order.customerAddress}, {order.customerCity}</p>
                          <p className="text-indigo-600 font-black mt-2">{order.customerMobile}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                              <span>{item.name} x{item.quantity}</span>
                              <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest">No orders yet.</p>}
                </div>
              </div>
            )}

            {adminSubTab === 'deployment' && (
              <div className="bg-white p-8 md:p-16 rounded-[3rem] border border-slate-100 shadow-xl max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">⚙️</div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Settings</h3>
                </div>
                <div className="space-y-6 text-slate-600 leading-relaxed">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">Vercel Build Fix</h4>
                    <p className="text-sm">I have updated the package.json. Re-deploying on Vercel should now work without the "vite command not found" error.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-24">
            <section className="mesh-gradient min-h-[70vh] flex items-center justify-center text-center px-6 rounded-b-[5rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-4xl">
                  <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Official Store</div>
                  <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase">Hussain Innovat</h2>
                  <p className="text-indigo-200/60 text-lg md:text-xl font-medium tracking-widest uppercase mb-12">Quality Driven Innovation Hub</p>
                  <button onClick={() => document.getElementById('store')?.scrollIntoView({behavior:'smooth'})} className="bg-white text-slate-950 font-black px-12 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase text-[10px] tracking-widest">Explore Collection</button>
                </div>
            </section>

            <div id="store" className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">New Arrivals</h3>
                <input type="text" placeholder="Search Hussain's Innovations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-96 bg-white border border-slate-200 rounded-2xl py-5 px-8 outline-none font-bold shadow-sm focus:border-indigo-600 transition-colors" />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200 flex flex-col items-center">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-lg mb-6 max-w-md">The store is empty. Owner login required to add official products.</p>
                  {currentUser ? (
                    <button onClick={() => setView(ViewMode.ADMIN)} className="bg-indigo-600 text-white font-black px-10 py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl">Add Products Now</button>
                  ) : (
                    <button onClick={() => setIsAuthOpen(true)} className="bg-slate-900 text-white font-black px-10 py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-600 transition-colors">Owner Login</button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="innovation-card group bg-white rounded-[3rem] overflow-hidden flex flex-col shadow-sm">
                      <div className="relative aspect-square cursor-pointer overflow-hidden" onClick={() => setSelectedImage(product.images[0])}>
                        <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900">Official</div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h4 className="text-xl font-black text-slate-900 mb-2 truncate">{product.name}</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">{product.category}</p>
                        <p className="text-2xl font-black text-slate-950 mt-auto">Rs. {product.price.toLocaleString()}</p>
                        <button onClick={() => { setCart(p => [...p, {...product, quantity: 1}]); setIsCartOpen(true); }} className="mt-8 w-full bg-slate-950 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-lg">Add to Bag</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-white py-20 px-6 text-center rounded-t-[5rem]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Hussain Innovat</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black mb-12">Official Store & Technology Hub • Karachi, Pakistan</p>
          <div className="flex justify-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(cart.filter(i => i.id !== id))} onUpdateQty={(id, d) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onPlaceOrder={handlePlaceOrder} deliveryFee={250} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u) => {setCurrentUser(u); setView(ViewMode.ADMIN);}} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} siteName="Hussain Innovat" product={null} />
      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default App;
