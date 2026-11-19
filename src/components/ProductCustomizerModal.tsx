import React, { useState } from 'react';
import { X, Check, Plus, Minus, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCustomizerModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  onClose
}) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedBunIndex, setSelectedBunIndex] = useState(0);
  const [cheeseBurst, setCheeseBurst] = useState(false);
  const [extraTopping, setExtraTopping] = useState(false);
  const [notes, setNotes] = useState('');

  const sizes = product.options?.size || [];
  const bunsOrCrusts = product.options?.crustOrBun || [];
  const cheeseBurstPrice = product.options?.addCheeseBurst || 40;
  const extraToppingPrice = product.options?.extraPattyOrTopping || 45;

  // Compute unit price
  let extraPrice = 0;
  if (sizes[selectedSizeIndex]) {
    extraPrice += sizes[selectedSizeIndex].extraPrice;
  }
  if (bunsOrCrusts[selectedBunIndex]) {
    extraPrice += bunsOrCrusts[selectedBunIndex].extraPrice;
  }
  if (cheeseBurst) {
    extraPrice += cheeseBurstPrice;
  }
  if (extraTopping) {
    extraPrice += extraToppingPrice;
  }

  const finalUnitPrice = product.price + extraPrice;
  const finalTotalPrice = finalUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      selectedSize: sizes[selectedSizeIndex]?.name,
      selectedBun: bunsOrCrusts[selectedBunIndex]?.name,
      cheeseBurst,
      extraTopping,
      notes: notes.trim() || undefined,
      extraPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative h-28 sm:h-44 bg-amber-100 overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full transition shadow-md"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${product.isVeg ? 'bg-emerald-400' : 'bg-red-500'}`} />
              <span className="text-xs uppercase font-extrabold tracking-wider bg-black/40 px-2 py-0.5 rounded">
                {product.category}
              </span>
            </div>
            <h2 className="text-xl font-black mt-1 line-clamp-1">{product.name}</h2>
            <p className="text-xs text-amber-200 font-semibold mt-0.5">Base Price: ₹{product.price}</p>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Size selection */}
          {sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Select Portion / Size</span>
                <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">Required</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {sizes.map((s, idx) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      selectedSizeIndex === idx
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-amber-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSizeIndex === idx ? 'border-amber-600 bg-amber-600' : 'border-slate-300'}`}>
                        {selectedSizeIndex === idx && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm">{s.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {s.extraPrice === 0 ? 'Included' : `+₹${s.extraPrice}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Crust / Bun selection */}
          {bunsOrCrusts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>{product.category === 'pizzas' ? 'Choose Crust Style' : 'Choose Bun Type'}</span>
                <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">Required</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {bunsOrCrusts.map((b, idx) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setSelectedBunIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      selectedBunIndex === idx
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-amber-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedBunIndex === idx ? 'border-amber-600 bg-amber-600' : 'border-slate-300'}`}>
                        {selectedBunIndex === idx && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm">{b.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {b.extraPrice === 0 ? 'Standard' : `+₹${b.extraPrice}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons & Upgrades */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Mr Bun Chef Upgrades</span>
            </h3>

            <div className="space-y-2">
              {/* Molten Cheese Burst Toggle */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  cheeseBurst ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold' : 'border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={cheeseBurst}
                    onChange={(e) => setCheeseBurst(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-sm">Molten Cheese Burst Overflow 🧀</span>
                    <p className="text-[11px] text-slate-500 font-normal">Layer of gooey melted cheddar & mozzarella</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-700">+₹{cheeseBurstPrice}</span>
              </label>

              {/* Extra Topping / Double Patty Toggle */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  extraTopping ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold' : 'border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={extraTopping}
                    onChange={(e) => setExtraTopping(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-sm">
                      {product.category === 'pizzas' ? 'Extra Olives & Jalapeños' : 'Extra Crispy Patty / Paneer Slab'}
                    </span>
                    <p className="text-[11px] text-slate-500 font-normal">Loaded bite for heavy appetites</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-700">+₹{extraToppingPrice}</span>
              </label>
            </div>
          </div>

          {/* Kitchen notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra spicy, no onions, pack sauce separately"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              maxLength={100}
            />
          </div>

        </div>

        {/* Modal Footer with Quantity and Confirm */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-slate-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-98"
          >
            <span>Add Customized Item</span>
            <span className="text-base font-extrabold bg-black/20 px-2.5 py-0.5 rounded-lg">
              ₹{finalTotalPrice}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
