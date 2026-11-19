import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Flame, 
  Bike, 
  Printer, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Receipt,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { dbService } from '../services/db';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { 
    status: 'received', 
    label: 'Order Confirmed', 
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    desc: 'Mr Bun kitchen accepted your ticket'
  },
  { 
    status: 'preparing', 
    label: 'Grilling & Prepping', 
    icon: <ChefHat className="w-5 h-5 text-amber-500" />,
    desc: 'Artisan brioche buns toasting & patties sizzling'
  },
  { 
    status: 'baking', 
    label: 'Oven Baking', 
    icon: <Flame className="w-5 h-5 text-red-500" />,
    desc: 'Mozzarella & cheddar bubbling to perfection'
  },
  { 
    status: 'out_for_delivery', 
    label: 'Out For Delivery', 
    icon: <Bike className="w-5 h-5 text-blue-500" />,
    desc: 'Delivery partner Vikram S. is speeding your way'
  },
  { 
    status: 'delivered', 
    label: 'Delivered Fresh!', 
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    desc: 'Enjoy your hot meal! Don’t forget to leave a review'
  }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.orderStatus);
  const [showInvoice, setShowInvoice] = useState(false);

  // Simulate progress across stages for demo if order is newly created
  useEffect(() => {
    setCurrentStatus(order.orderStatus);

    if (order.orderStatus === 'received') {
      const t1 = setTimeout(() => {
        setCurrentStatus('preparing');
        dbService.updateOrderStatus(order.id, 'preparing');
      }, 5000);

      const t2 = setTimeout(() => {
        setCurrentStatus('baking');
        dbService.updateOrderStatus(order.id, 'baking');
      }, 15000);

      const t3 = setTimeout(() => {
        setCurrentStatus('out_for_delivery');
        dbService.updateOrderStatus(order.id, 'out_for_delivery');
      }, 30000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [order.id, order.orderStatus]);

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'baking': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bike className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded font-bold">
                  {order.id}
                </span>
                <span className="text-xs text-amber-200">
                  {order.deliveryType === 'delivery' ? 'Express Delivery' : 'Pickup at Store'}
                </span>
              </div>
              <h2 className="text-xl font-black mt-0.5">Live Order Tracker</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoice(!showInvoice)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{showInvoice ? 'Hide Receipt' : 'View Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
              aria-label="Close tracking"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Estimated Delivery Time Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Estimated Delivery</p>
                <p className="text-lg font-black text-slate-900">
                  {currentStatus === 'delivered' ? 'Delivered' : '20 - 25 Minutes'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-amber-500 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                {currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Live Kitchen &amp; Delivery Progress
            </h3>

            <div className="space-y-3">
              {STEPS.map((step, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={step.status}
                    className={`flex items-start gap-3.5 p-3 rounded-2xl transition border ${
                      isCurrent
                        ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                        : isPassed
                        ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                        : 'border-transparent opacity-40 text-slate-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isPassed ? 'bg-white shadow-sm' : 'bg-slate-100'
                    }`}>
                      {step.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-amber-950' : 'text-slate-800'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full animate-pulse">
                            In Progress
                          </span>
                        )}
                        {idx < currentIndex && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Done</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Rider Details if Out for Delivery */}
          {currentIndex >= 3 && (
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  VS
                </div>
                <div>
                  <p className="text-xs text-blue-900 font-bold">Delivery Hero: Vikram Sharma</p>
                  <p className="text-[11px] text-slate-500">Fast Food Courier • Temp: 98.4°F Normal</p>
                </div>
              </div>

              <a
                href="tel:9476088111"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider (9476088111)</span>
              </a>
            </div>
          )}

          {/* Delivery Address & Contact */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Delivering To:</span>
                <p className="text-slate-600 mt-0.5">{order.deliveryAddress}</p>
              </div>
            </div>
            {order.orderNotes && (
              <p className="text-[11px] text-amber-800 italic pt-1 border-t border-slate-200">
                Note: {order.orderNotes}
              </p>
            )}
          </div>

          {/* Digital Tax Invoice View */}
          {showInvoice && (
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-800 shadow-md print:shadow-none space-y-4 font-mono text-xs text-slate-800">
              
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900">Mr Bun Fast Food</h4>
                  <p className="text-[11px] text-slate-600">Company: Mr Bun</p>
                  <p className="text-[11px] text-slate-600">Helpline: 9476088111</p>
                  <p className="text-[11px] text-slate-600">Email: contact@mrbun.in</p>
                  <p className="text-[11px] text-slate-600 font-bold">FSSAI Lic: 22926112000173</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">TAX INVOICE</span>
                  <p className="text-[11px] text-slate-500">Order ID: {order.id}</p>
                  <p className="text-[11px] text-slate-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-700 font-bold uppercase">{order.paymentMethod} • {order.paymentStatus}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 border-b border-slate-200 pb-3">
                <div className="flex justify-between font-bold text-slate-700 text-[11px] uppercase border-b pb-1">
                  <span>Item &amp; Customization</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="w-16 text-right">Amount</span>
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800">
                    <div className="flex-1 pr-2">
                      <p className="font-semibold">{item.product.name}</p>
                      {item.selectedSize && <p className="text-[10px] text-slate-500">Size: {item.selectedSize}</p>}
                      {item.cheeseBurst && <p className="text-[10px] text-slate-500">+ Cheese Burst</p>}
                    </div>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <span className="w-16 text-right font-bold">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Invoice Totals */}
              <div className="space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-800 text-slate-900">
                  <span>Grand Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Print Button */}
              <div className="pt-2 flex justify-end print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

            </div>
          )}

          {/* Need help footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FSSAI License: <strong>22926112000173</strong></span>
            </span>
            <a href="tel:9476088111" className="text-amber-700 font-bold hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Need help? Call 9476088111</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
