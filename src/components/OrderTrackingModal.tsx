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
  Sparkles,
  Mail,
  AlertTriangle,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { dbService } from '../services/db';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { 
    status: 'pending', 
    label: 'Awaiting Owner Approval', 
    icon: <Clock className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />,
    desc: 'Order placed & details messaged to Owner (9476088111 & contact@mrbun.in)'
  },
  { 
    status: 'confirmed', 
    label: 'Confirmed by Owner', 
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    desc: 'Owner approved ticket! Confirmation SMS & Email dispatched to your phone'
  },
  { 
    status: 'preparing', 
    label: 'Kitchen Grilling & Baking', 
    icon: <ChefHat className="w-5 h-5 text-amber-500" />,
    desc: 'Artisan brioche buns toasting & mozzarella bubbling (Cash verified if COD)'
  },
  { 
    status: 'out_for_delivery', 
    label: 'Out For Delivery', 
    icon: <Bike className="w-5 h-5 text-blue-500" />,
    desc: 'Delivery hero Vikram S. is speeding hot food to your doorstep'
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

  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.orderStatus);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showNotificationLogs, setShowNotificationLogs] = useState(true);

  // Sync state whenever prop changes or when refreshing from db
  useEffect(() => {
    setCurrentOrder(order);
    setCurrentStatus(order.orderStatus);
  }, [order]);

  const refreshLiveOrder = async () => {
    const all = await dbService.getAllOrders();
    const found = all.find(o => o.id === currentOrder.id);
    if (found) {
      setCurrentOrder(found);
      setCurrentStatus(found.orderStatus);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed':
      case 'received': return 1;
      case 'preparing':
      case 'baking': return 2;
      case 'ready':
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  const handlePrint = () => {
    window.print();
  };

  // Quick Demo Simulator for user to test approving the order right from tracker if they want
  const handleSimulateOwnerApproval = async () => {
    const updated = await dbService.approveOrder(currentOrder.id);
    if (updated) {
      setCurrentOrder(updated);
      setCurrentStatus(updated.orderStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Bike className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded font-bold">
                  {currentOrder.id}
                </span>
                <span className="text-xs text-amber-200">
                  {currentOrder.deliveryType === 'delivery' ? 'Express Delivery' : 'Pickup at Store'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-0.5">Live Order Tracker</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshLiveOrder}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition"
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowInvoice(!showInvoice)}
              className="px-2.5 sm:px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Current Status Highlight Banner */}
          {currentStatus === 'pending' ? (
            <div className="bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-50 p-4 rounded-2xl border-2 border-amber-400/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase text-amber-900 tracking-wider">Status: Pending Owner Approval</p>
                    <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      Action Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Order details have been messaged to Owner Phone (<strong>9476088111</strong>) &amp; Email (<strong>contact@mrbun.in</strong>). Awaiting kitchen approval.
                  </p>
                </div>
              </div>

              {/* Quick simulation helper for demonstration */}
              <button
                type="button"
                onClick={handleSimulateOwnerApproval}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
                title="Click to simulate owner clicking approve in Admin Dashboard"
              >
                ✓ Simulate Owner Approval
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-4 rounded-2xl border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900 uppercase">Status: Confirmed by Owner</p>
                  <p className="text-sm font-black text-slate-900">
                    {currentStatus === 'delivered' ? 'Food Delivered!' : 'Kitchen is Preparing Hot Food'}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                {currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          {/* Stepper Progress */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Live Approval &amp; Preparation Workflow
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
                      isPassed ? 'bg-white shadow-xs' : 'bg-slate-100'
                    }`}>
                      {step.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-amber-950 font-black' : 'text-slate-800'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full animate-pulse">
                            Current Stage
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

          {/* SMS & Email Notification Dispatch Logs */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-amber-900">
                <BellRing className="w-4 h-4 text-amber-600" />
                <span>SMS &amp; Email Notification Dispatch Logs</span>
              </span>
              <button
                type="button"
                onClick={() => setShowNotificationLogs(!showNotificationLogs)}
                className="text-amber-700 hover:underline text-[11px]"
              >
                {showNotificationLogs ? 'Hide' : 'Show Details'}
              </button>
            </div>

            {showNotificationLogs && (
              <div className="space-y-2 text-xs pt-1 border-t border-slate-200/60">
                {/* 1. Message to Owner */}
                <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-800">📩 Order Sent to Owner Phone &amp; Email</span>
                      <span className="text-emerald-700 font-bold">Dispatched</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Dispatched to Owner: <strong>9476088111</strong> (SMS/WhatsApp) &amp; <strong>contact@mrbun.in</strong> (Email)
                    </p>
                  </div>
                </div>

                {/* 2. Confirmation to Customer */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-800">📱 Customer Confirmation SMS &amp; Email</span>
                      <span className={`font-bold ${currentOrder.customerConfirmation ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {currentOrder.customerConfirmation ? '✓ Delivered to Customer' : 'Pending Owner Approval'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Destination: <strong>{currentOrder.customerPhone}</strong> &amp; <strong>{currentOrder.customerEmail}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cash Payment Policy Banner if COD */}
          {currentOrder.paymentMethod === 'cod' && (
            <div className="bg-red-50 p-3.5 rounded-2xl border border-red-200 text-xs flex items-center gap-2.5 text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Cash Payment Condition</p>
                <p className="text-[11px] text-red-700">Cash is collected and verified strictly before kitchen food preparation commences.</p>
              </div>
            </div>
          )}

          {/* Delivery Rider Details if Out for Delivery */}
          {currentIndex >= 3 && (
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  VS
                </div>
                <div>
                  <p className="text-xs text-blue-900 font-bold">Delivery Hero: Vikram Sharma</p>
                  <p className="text-[11px] text-slate-500">Fast Food Courier • Verified Hot Warmer Pack</p>
                </div>
              </div>

              <a
                href="tel:9476088111"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call (9476088111)</span>
              </a>
            </div>
          )}

          {/* Delivery Address & Contact */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Delivery Address</span>
            </div>
            <p className="text-slate-600 pl-6">{currentOrder.deliveryAddress}</p>
            <p className="text-slate-500 pl-6 text-[11px]">
              Recipient: {currentOrder.customerName} ({currentOrder.customerPhone})
            </p>
          </div>

          {/* Printable Invoice View toggle */}
          {showInvoice && (
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-md space-y-4 print:block">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-black font-display text-amber-950">Mr Bun Fast Food</h3>
                  <p className="text-[10px] text-slate-500">Tax Invoice • FSSAI Lic: 22926112000173</p>
                  <p className="text-[10px] text-slate-500">Helpline: 9476088111 • contact@mrbun.in</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold">{currentOrder.id}</span>
                  <p className="text-[10px] text-slate-400">{new Date(currentOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.product.name} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                    <span className="font-bold">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{currentOrder.subtotal}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-₹{currentOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST (5%)</span>
                  <span>₹{currentOrder.tax}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery</span>
                  <span>₹{currentOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-sm text-slate-900">
                  <span>Total Paid ({currentOrder.paymentMethod.toUpperCase()})</span>
                  <span>₹{currentOrder.totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default OrderTrackingModal;
