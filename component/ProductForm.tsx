import React, { useState, useRef } from 'react';
import { Product, Category, User } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface ProductFormProps {
  onAdd: (product: Product) => void;
  currentUser: User | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAdd, currentUser }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || images.length === 0) {
      alert("Hussain bhai, please add at least one image and a name.");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      createdAt: Date.now(),
      sellerId: currentUser?.id,
      sellerName: currentUser?.name
    });

    setName('');
    setDescription('');
    setPrice('');
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAiDescription = async () => {
    if (!name) return alert("Enter innovation name first!");
    setIsGenerating(true);
    const desc = await generateProductDescription(name, category);
    setDescription(desc);
    setIsGenerating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-6 md:space-y-8 sticky top-28">
      <div>
        <h3 className="text-xl md:text-2xl font-black text-slate-950 mb-1 tracking-tight">List Innovation</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Store Inventory Management</p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 md:px-7 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold" placeholder="High-End Innovation" required />
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Price (PKR)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-5 py-4 md:px-7 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" placeholder="0" required />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full px-5 py-4 md:px-7 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold appearance-none">
              <option value="Electronics">Electronics</option>
              <option value="Home">Home</option>
              <option value="Fashion">Fashion</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Description</label>
            <button type="button" onClick={handleAiDescription} disabled={isGenerating} className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2">
              {isGenerating ? 'AI Reasoning...' : 'AI Assistant ✨'}
            </button>
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 md:px-7 md:py-5 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none h-32 md:h-40 resize-none transition-all font-medium text-slate-600 leading-relaxed" placeholder="Write the story of this innovation..." />
        </div>

        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Showcase Gallery</label>
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square group rounded-xl md:rounded-2xl overflow-hidden border border-slate-100">
                <img src={img} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black text-[9px] uppercase">Remove</button>
              </div>
            ))}
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all aspect-square text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
        </div>
      </div>

      <button type="submit" className="w-full bg-slate-950 text-white font-black py-5 md:py-6 rounded-[1.8rem] md:rounded-[2.2rem] hover:bg-indigo-600 transition-all shadow-2xl active:scale-[0.98] uppercase tracking-[0.3em] text-[9px] md:text-[10px]">
        Deploy to Hussain Innovat
      </button>
    </form>
  );
};

export default ProductForm;