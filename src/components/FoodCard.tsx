import React from 'react';
import { Plus, Star, Flame, Sliders } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product, onCustomize }) => {
  const { addToCart, items } = useCart();

  // Check if item has customizable options (sizes, crusts, cheese burst)
  const isCustomizable = !!(
    product.options?.size?.length ||
    product.options?.crustOrBun?.length ||
    product.options?.addCheeseBurst
  );

  // Check how many of this product are in cart
  const cartQuantity = items
    .filter((i) => i.product.id === product.id)
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAdd = () => {
    if (isCustomizable) {
      onCustomize(product);
    } else {
      addToCart(product);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-amber-100/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between">
      
      {/* Image & Tags Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-sm border border-slate-200">
          <div
            className={`w-3.5 h-3.5 border-2 flex items-center justify-center ${
              product.isVeg ? 'border-emerald-600' : 'border-red-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                product.isVeg ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
          </div>
        </div>

        {/* Badges: Bestseller / New / Discount */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {product.isPopular && (
            <span className="bg-gradient-to-r from-amber-500 to-red-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Spicy indicator if applicable */}
        {product.spicyLevel && product.spicyLevel > 0 && (
          <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-0.5 text-[10px] text-white">
            <Flame className="w-3 h-3 text-red-500 fill-red-500" />
            <span className="font-bold">
              {product.spicyLevel === 3 ? 'Extra Hot' : product.spicyLevel === 2 ? 'Spicy' : 'Mild'}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Tag info */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
            {product.tags && product.tags[0] && (
              <span className="text-[11px] font-semibold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
                {product.tags[0]}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-amber-950">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {isCustomizable && (
              <p className="text-[10px] font-medium text-amber-700 flex items-center gap-0.5">
                <Sliders className="w-2.5 h-2.5" />
                <span>Customizable</span>
              </p>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
              cartQuantity > 0
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
            }`}
          >
            {cartQuantity > 0 ? (
              <>
                <span>Added ({cartQuantity})</span>
                <Plus className="w-3.5 h-3.5" />
              </>
            ) : isCustomizable ? (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>Add / Customize</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
