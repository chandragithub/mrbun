import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  ShieldAlert, 
  Truck, 
  HelpCircle, 
  Sparkles,
  PhoneCall,
  Mail,
  ArrowRight,
  ShieldCheck,
  FileQuestion,
  PartyPopper
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const RefundsPage: React.FC = () => {
  const { settings } = useSettings();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const cancellationWindows = [
    {
      stage: 'Within 60 Seconds of Ordering',
      status: 'Instant Full Refund (100%)',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'You can cancel instantly if you placed the order by mistake, before the outlet kitchen receives and accepts the ticket.',
      charge: '0% Cancellation Fee'
    },
    {
      stage: 'Kitchen Has Accepted / Preparing (Past 60 Seconds)',
      status: 'No Cancellation / 100% Prep Charge',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      description: 'Once our chefs begin smashing burger patties, baking sourdough crusts, and assembling fresh ingredients, items cannot be reused or restocked.',
      charge: '100% Food Cost Applies'
    },
    {
      stage: 'Out for Delivery / Rider Assigned',
      status: 'Non-Cancellable',
      statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      description: 'The rider has picked up the sealed thermal food container and is en route to your address. The order cannot be intercepted or refunded.',
      charge: '100% Value Forfeited'
    },
    {
      stage: 'Customer Unreachable at Delivery Address',
      status: 'Order Abandoned / No Refund',
      statusColor: 'text-slate-800 bg-slate-100 border-slate-300',
      description: 'If rider waits past 10 minutes and you do not answer the phone or gate intercom, the perishable order is marked undeliverable.',
      charge: 'Full Amount Retained'
    }
  ];

  const eligibleScenarios = [
    {
      title: 'Missing or Incomplete Items',
      desc: 'If an item is missing from your sealed delivery bag, we immediately credit or refund the exact value of the missing item after verification.',
      badge: 'Pro-rated Instant Refund'
    },
    {
      title: 'Completely Wrong Item Delivered',
      desc: 'If you ordered a vegetarian paneer burger and received a non-veg item, or received an entirely incorrect dish, we issue an immediate replacement or full item refund.',
      badge: 'Full Item Refund / Redelivery'
    },
    {
      title: 'Spill / Transit Damage',
      desc: 'If a shake or beverage spilled heavily due to courier handling rendering the food unconsumable, submit a photo within 15 minutes of delivery for resolution.',
      badge: 'Photo Evidence Required'
    },
    {
      title: 'Unforeseen Kitchen Cancellation',
      desc: 'If an outlet is forced to close due to power/operational outage or run out of stock after payment, a 100% automatic refund is triggered to your source payment method.',
      badge: '100% Automatic Refund'
    }
  ];

  const nonEligibleScenarios = [
    'Change of mind or personal taste dissatisfaction (e.g. food is "too spicy" or "not sweet enough" when prepared per standard menu recipe).',
    'Delays caused by incorrect address, missing floor number, unverified landmark, or gated security refusal.',
    'Failure to collect food from the delivery executive within the 10-minute waiting window.',
    'Claims submitted more than 30 minutes after delivery completion or after consuming the majority of the meal.',
    'Special requests made in order notes that contradict the standard menu without prior outlet confirmation.'
  ];

  const refundMethods = [
    {
      method: 'UPI (GPay / PhonePe / Paytm / BHIM)',
      tat: 'Instant to 2–4 Hours',
      note: 'Direct credit to the originating VPA/bank account.'
    },
    {
      method: 'Credit / Debit Cards',
      tat: '3 to 5 Business Days',
      note: 'Subject to your issuing bank and card network cycle.'
    },
    {
      method: 'Net Banking & Digital Wallets',
      tat: '2 to 4 Business Days',
      note: 'Credited directly back into your digital wallet or bank balance.'
    },
    {
      method: 'Cash on Delivery (COD) Orders',
      tat: 'Within 24 Hours',
      note: 'Transferred via UPI payout link or stored brand credit upon verification.'
    }
  ];

  const faqs = [
    {
      q: 'How do I cancel my order if I made a mistake?',
      a: 'If you just placed the order within the last 60 seconds, call our outlet hotline immediately or visit the Live Order Tracking page. If the kitchen has not accepted the ticket, cancellation is free of charge.'
    },
    {
      q: 'Why does Mr Bun charge 100% cancellation once the food is preparing?',
      a: 'Unlike retail goods, fast food items are perishables prepared fresh on demand. Once brioche buns are toasted, artisan patties are grilled, and sauces are layered, that food cannot be served to anyone else and must be discarded.'
    },
    {
      q: 'What is the cancellation policy for Party Catering & Bulk Boxes?',
      a: 'For bulk packages booked through /parties: Cancellations made at least 24 hours prior to the event are eligible for a 75% refund of the advance deposit. Cancellations made between 12–24 hours receive 50%. Cancellations made under 12 hours are non-refundable as fresh batch baking has commenced.'
    },
    {
      q: 'What proof is needed to claim a refund for a damaged or missing item?',
      a: 'Simply click a clear photo of the delivered package, the external bill receipt, and the contents, then share it via WhatsApp or email to our customer grievance desk within 15 minutes of delivery.'
    }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Fair Dealing Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white">
            Refunds &amp; Cancellations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            At <strong className="text-white">{settings.brandName}</strong>, we take immense pride in crafting each brioche burger, artisan pizza, and beverage with supreme quality. This policy outlines our cancellation windows, refund criteria, and dispute resolutions in full compliance with Indian consumer protection and hospitality standards.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2">
            <span>Standard Perishable Kitchen Policy</span>
            <span>•</span>
            <span className="font-mono text-amber-400">FSSAI: {settings.fssaiLicense}</span>
            <span>•</span>
            <Link to="/terms" className="text-amber-400 hover:underline font-semibold">
              Read General Terms &amp; Conditions →
            </Link>
          </div>
        </div>
      </div>

      {/* Cancellation Windows (Timeline Table) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Stage-by-Stage Policy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Order Cancellation Windows
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Because our kitchens operate on rapid ticket-dispatch to guarantee fresh, steaming hot food within 30 minutes, cancellation rights vary depending on the preparation stage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {cancellationWindows.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-900 font-display">
                    {item.stage}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Applicable Cost:</span>
                <span className="text-slate-900 font-extrabold">{item.charge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* When are you eligible for a refund? */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Legitimate Claims</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Eligible Refund Scenarios
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          We want you to love your meal. If an error occurs on our end, we resolve it promptly and fairly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {eligibleScenarios.map((sc, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
              <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {sc.badge}
              </span>
              <h3 className="text-sm font-black text-slate-900 font-display">{sc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{sc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Eligible Situations (Business Protection) */}
      <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Non-Refundable Circumstances</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
          Situations Not Covered for Refund or Compensation
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          To protect against fraudulent claims, food waste, and frivolous cancellations, the following cases are strictly excluded from refunds:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {nonEligibleScenarios.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Refund Processing Mode & Turnaround Times (TAT) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
          <CreditCard className="w-4 h-4 text-amber-600" />
          <span>Banking Turnaround Times</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          How and When Will You Receive Your Refund?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Once an authorized refund is approved by our operations desk, the payment gateway initiates settlement back to the original funding source.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Payment Mode</th>
                <th className="py-3.5 px-4 sm:px-6">Expected Turnaround Time (TAT)</th>
                <th className="py-3.5 px-4 sm:px-6">Settlement Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {refundMethods.map((m, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">{m.method}</td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-700">{m.tat}</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-500">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Party & Catering Special Cancellation Clause */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
          <PartyPopper className="w-4 h-4 text-amber-600" />
          <span>Bulk &amp; Party Catering Clause</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
          Party Catering &amp; Event Box Cancellation Terms
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Because event catering requires reservation of kitchen slots, customized patty molding, and bulk bakery bun procurement:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white rounded-xl p-3.5 border border-amber-200">
            <span className="font-extrabold text-emerald-700 block text-sm">24+ Hours Notice</span>
            <p className="text-slate-600 mt-1">75% refund of advance deposit (25% retained for bakery prep overheads).</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-amber-200">
            <span className="font-extrabold text-amber-800 block text-sm">12 to 24 Hours Notice</span>
            <p className="text-slate-600 mt-1">50% refund of advance deposit.</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-amber-200">
            <span className="font-extrabold text-rose-700 block text-sm">&lt; 12 Hours Notice</span>
            <p className="text-slate-600 mt-1">No refund as fresh ingredient preparation has already commenced.</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Common Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                <span className="text-amber-600 font-black text-base shrink-0">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Contact / Grievance Desk */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Grievance &amp; Redressal Desk</span>
          </div>
          <h3 className="text-xl font-black font-display text-white">
            Need urgent assistance with an order?
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Reach our central operations desk directly. Please have your Order Number ready for immediate verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href={`tel:${settings.phone}`}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Hotline: {settings.phone}</span>
          </a>
          <a
            href={`mailto:${settings.email}?subject=Refund%20Request%20-%20Order%20Help`}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-xs border border-slate-700 flex items-center gap-2 transition"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email Grievance Desk</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default RefundsPage;
