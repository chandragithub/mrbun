import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  Clock, 
  Truck, 
  CreditCard, 
  Users, 
  HelpCircle,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Mail,
  CheckCircle2,
  Lock,
  Building2
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance & Operating Entity', icon: FileText },
    { id: 'operator', title: '2. Platform Development & Maintenance (Ceansys Technologies)', icon: Building2 },
    { id: 'eligibility', title: '3. User Eligibility & Account Security', icon: Users },
    { id: 'orders', title: '4. Ordering, Menu & Kitchen Acceptance', icon: Clock },
    { id: 'pricing', title: '5. Pricing, Taxes, Delivery & Minimum Order', icon: CreditCard },
    { id: 'delivery', title: '6. Dispatch, Delivery & Geo-Coverage', icon: Truck },
    { id: 'parties', title: '7. Bulk Orders & Party Catering Commitments', icon: Sparkles },
    { id: 'food-quality', title: '8. Food Quality, Allergens & Statutory FSSAI', icon: ShieldCheck },
    { id: 'ip', title: '9. Intellectual Property & Brand Rights', icon: Lock },
    { id: 'liability', title: '10. Limitation of Liability & Force Majeure', icon: AlertTriangle },
    { id: 'governing-law', title: '11. Dispute Resolution & Governing Jurisdiction', icon: Scale },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white">
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Welcome to <strong className="text-white">{settings.brandName}</strong>. Please read these Terms and Conditions carefully before ordering food, booking catering packages, or using our website, mobile interface, or digital services.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span className="font-mono text-amber-400">FSSAI Lic: {settings.fssaiLicense}</span>
            <span>•</span>
            <Link to="/refunds" className="text-amber-400 hover:underline font-semibold">
              Read Refund &amp; Cancellation Policy →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sticky Table of Contents Sidebar */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-black text-slate-900 uppercase tracking-wider px-3 py-1">
              Table of Contents
            </p>
            <nav className="space-y-1">
              {sections.map(s => {
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition flex items-center gap-2.5 ${
                      isActive 
                        ? 'bg-amber-100 text-amber-900 font-bold border-l-4 border-amber-600' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-700' : 'text-slate-400'}`} />
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 px-3">
              <p className="text-[11px] text-slate-500">Need legal assistance?</p>
              <a 
                href={`mailto:${settings.email}`} 
                className="text-xs text-amber-700 hover:underline font-bold flex items-center gap-1 mt-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{settings.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="lg:col-span-3 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Quick Notice Highlight */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-3.5 text-amber-950">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base text-amber-900 font-display">
                Protection &amp; Fair Dealing Commitment
              </h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                As an artisan culinary kitchen preparing made-to-order perishables (brioche burgers, sourdough pizzas, thick shakes), our operations are governed strictly to prevent food wastage, maintain culinary safety, and ensure rapid delivery dispatch across all active outlets.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section id="acceptance" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Section 1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              1. Acceptance &amp; Operating Agreement
            </h2>
            <p>
              By accessing, browsing, registering on, or placing orders through the <strong>{settings.brandName}</strong> website, mobile progressive web application, physical QR-code table ordering desks, or digital interfaces, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms &amp; Conditions and all referenced policies (including our <Link to="/refunds" className="text-amber-700 font-bold hover:underline">Refunds &amp; Cancellations Policy</Link>).
            </p>
            <p>
              If you do not agree with any part of these Terms, you must immediately discontinue using our digital platform and refrain from placing orders or reserving catering services.
            </p>
          </section>

          {/* Section 2: Dedicated Ceansys Technologies Management Clause */}
          <section id="operator" className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Section 2</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              2. Platform Development &amp; Management by Ceansys Technologies
            </h2>
            <p className="font-semibold text-slate-800">
              This website and digital ordering application is exclusively developed, hosted, secured, and maintained by{' '}
              <a 
                href="https://ceansys.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-700 hover:text-amber-800 font-extrabold underline decoration-amber-500 hover:decoration-amber-700 transition"
              >
                Ceansys Technologies
              </a>{' '}
              (<a href="https://ceansys.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-amber-800 underline">ceansys.com</a>).
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Application Management:</strong> For all legal, commercial, and technical purposes governing this digital application, <strong>Ceansys Technologies</strong> is the technology company responsible for managing the platform infrastructure, software architecture, digital security, database systems, and online transaction interfaces.
              </li>
              <li>
                <strong>Food &amp; Kitchen Operations:</strong> Culinary food preparation, kitchen cooking, recipe formulation, ingredient procurement, physical restaurant dine-in seating, and local food delivery dispatches are operated under the culinary hospitality brand <strong>{settings.brandName}</strong> (FSSAI License: <span className="font-mono font-bold text-slate-900">{settings.fssaiLicense}</span>).
              </li>
              <li>
                <strong>Agreement Scope:</strong> By interacting with this platform, you expressly recognize <strong>Ceansys Technologies</strong> as the managing technology entity overseeing your digital interactions, communications, and electronic order facilitation.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="eligibility" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Section 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              3. User Eligibility &amp; Account Security
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Age Requirements:</strong> You must be at least 18 years of age or possess legal parental/guardian consent under applicable Indian laws to register an account and transact on {settings.brandName}.
              </li>
              <li>
                <strong>Accuracy of Information:</strong> You agree to provide true, accurate, current, and complete information regarding your name, active WhatsApp/mobile phone number, delivery address, and landmarks. {settings.brandName} is not responsible for failed deliveries resulting from inaccurate contact details.
              </li>
              <li>
                <strong>Account Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your login credentials and OTP verifications. Any order placed through your verified phone number or credentials will be deemed authorized by you.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="orders" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Section 4</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              4. Ordering, Menu &amp; Kitchen Acceptance
            </h2>
            <p>
              Every food order placed on our platform constitutes an offer to purchase freshly prepared perishables.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Kitchen Order Acceptance:</strong> Once an order is placed, our central/outlet kitchen reviews ingredient inventory and assigns kitchen stations. An order is confirmed once marked <em>Accepted</em> or <em>Preparing</em> in our Point-of-Sale / Kitchen Display System.
              </li>
              <li>
                <strong>Made-to-Order Perishables:</strong> Because every brioche burger patty is freshly smashed and pizzas are stone-baked upon confirmation, food items cannot be restocked or returned once kitchen prep commences.
              </li>
              <li>
                <strong>Item Availability &amp; Substitutions:</strong> While we strive to maintain real-time inventory, certain seasonal ingredients or limited-edition items may become unavailable. In such rare events, our outlet manager will contact you via phone or WhatsApp to offer an equivalent upgrade or issue an instant refund for that item.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="pricing" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Section 5</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              5. Pricing, Taxes, Delivery Charges &amp; Minimum Order
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>All Prices in Indian Rupees (INR):</strong> All prices displayed on our menu include or explicitly detail statutory Goods and Services Tax (GST) as applicable under restaurant hospitality law.
              </li>
              <li>
                <strong>Delivery &amp; Packaging Fee:</strong> In order to maintain food warmth and prevent spillages, specialized thermal-insulated food-grade packaging is utilized. Applicable delivery and packaging fees are calculated based on distance and cart volume, and are displayed transparently prior to checkout.
              </li>
              <li>
                <strong>Dynamic Pricing &amp; Offers:</strong> Discount coupon codes and promotional bundles are time-sensitive, non-transferable, and cannot be clubbed with unapproved offers. {settings.brandName} reserves the right to modify or withdraw coupon promotions at its discretion.
              </li>
              <li>
                <strong>Secure Payments:</strong> Digital transactions via UPI, Credit/Debit Cards, Net Banking, and Wallets are handled through RBI-authorized payment aggregators. {settings.brandName} never stores full debit/credit card CVV or payment passwords.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="delivery" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Section 6</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              6. Dispatch, Delivery Timeframes &amp; Geo-Coverage
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Estimated Delivery Timelines:</strong> Stated delivery times (typically 25–40 minutes) are reasonable estimates based on normal kitchen traffic, order complexity, and transit conditions.
              </li>
              <li>
                <strong>Customer Availability:</strong> Our delivery executive will attempt to contact you upon arriving at your address. If the customer is unreachable or fails to receive the package within 10 minutes of arrival, the order will be marked as delivered/abandoned, and no refund will be payable due to perishable spoilage.
              </li>
              <li>
                <strong>Restricted Premises:</strong> For high-rise gated communities, tech parks, or institutional campuses that restrict courier entry, the delivery executive will hand over the food package at the designated main gate/security reception.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="parties" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Section 7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              7. Bulk Orders &amp; Party Catering Commitments
            </h2>
            <p>
              Special terms apply to our curated Party Boxes, Corporate Bulk Orders, and Live Counter Catering booked through <Link to="/parties" className="text-amber-700 font-bold hover:underline">/parties</Link>:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Advance Slot Booking:</strong> Large orders (exceeding 25 pax or customized live food stations) require a minimum 50% non-refundable advance deposit to block kitchen culinary staff and fresh bakery procurement.
              </li>
              <li>
                <strong>Guest Count Adjustments:</strong> Final headcount adjustments must be notified in writing at least 12 hours prior to the event schedule. Reductions made under 12 hours cannot be adjusted against the billing minimum.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="food-quality" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Section 8</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              8. Food Quality, Allergens &amp; Statutory FSSAI Compliance
            </h2>
            <p>
              {settings.brandName} is dedicated to culinary hygiene, holding valid licenses from the Food Safety and Standards Authority of India (FSSAI License: <strong>{settings.fssaiLicense}</strong>).
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Immediate Consumption:</strong> Prepared fast food, loaded fries, melted cheese, and chilled beverages are intended for immediate consumption within 45 minutes of delivery. {settings.brandName} accepts no liability for food spoiled due to improper home storage or reheating.
              </li>
              <li>
                <strong>Allergen Notice:</strong> Our kitchens handle gluten, dairy, soy, nuts, and sesame seeds. While we follow strict sanitization protocols, trace cross-contact can occur. Customers with severe medical food allergies must exercise personal discretion and notify our team beforehand.
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section id="ip" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Section 9</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              9. Intellectual Property &amp; Platform Ownership
            </h2>
            <p>
              All software application code, algorithms, databases, user interface designs, and infrastructure developed for this platform are the proprietary intellectual property of <strong>Ceansys Technologies</strong>. All culinary trademarks, brand names, recipes, menu titles, and restaurant imagery are property of <strong>{settings.brandName}</strong>. Any unauthorized copying, reverse engineering, or commercial scraping is strictly prohibited.
            </p>
          </section>

          {/* Section 10 */}
          <section id="liability" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Section 10</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              10. Limitation of Liability &amp; Force Majeure
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Monetary Liability Cap:</strong> In any circumstance, the aggregate financial liability of {settings.brandName} and managing technology partner Ceansys Technologies toward any claim arising out of a food delivery transaction shall be strictly limited to the actual net amount paid by the customer for that specific order.
              </li>
              <li>
                <strong>Force Majeure:</strong> Neither party shall be held liable for delayed delivery, transit failures, or kitchen closures caused by events beyond reasonable control, including severe weather, flooding, strikes, civic road blockages, natural disasters, municipal restrictions, or network communication outages.
              </li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="governing-law" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3.5 scroll-mt-24">
            <div className="flex items-center gap-2.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Section 11</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              11. Dispute Resolution &amp; Governing Jurisdiction
            </h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the substantive laws of India. Any unresolved dispute, controversy, or claim arising out of or relating to your purchase or platform usage shall be subject to the exclusive jurisdiction of the competent courts located within the jurisdiction of our registered operating headquarters.
            </p>
          </section>

          {/* Contact Support Footer Card */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-black font-display text-white">Have questions about these terms?</h3>
              <p className="text-xs text-slate-400">Our customer support and grievance desk is happy to help.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${settings.phone}`}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Us</span>
              </a>
              <Link
                to="/refunds"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition"
              >
                <span>Refund Policy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TermsPage;
