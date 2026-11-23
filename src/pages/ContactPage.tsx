import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Party & Catering Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('Please enter your name, contact phone, and message.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
    }, 800);
  };

  const FAQS = [
    {
      q: 'What is your delivery radius and turnaround time?',
      a: 'We deliver within a 10 km radius from each outlet. Express delivery orders typically arrive within 25–35 minutes in thermal hot boxes.'
    },
    {
      q: 'How much notice is needed for bulk party catering?',
      a: 'For small house parties (10–25 guests), 2 to 4 hours notice is sufficient. For large gatherings (30–150+ guests) or live burger counter setups, we recommend booking at least 24 hours in advance.'
    },
    {
      q: 'Can we customize burgers, pizzas and mocktails for parties?',
      a: 'Yes! You can specify dietary requirements (e.g. 70% Pure Veg / 30% Non-Veg, Jain options, extra cheese burst, spicy vs mild) when booking your party package.'
    },
    {
      q: 'What are your food safety certifications?',
      a: 'Mr Bun is fully certified by the Food Safety and Standards Authority of India under FSSAI License No. 22926112000173.'
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full">
          We Are Here For You
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Contact <span className="text-amber-600">{settings.brandName}</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Have a question about our menu, need custom party catering, or want to visit our kitchen? Our team is always ready to assist!
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Phone */}
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Direct Helpline</h3>
          <p className="text-xs text-slate-500">For phone orders, catering inquiries &amp; live support.</p>
          <a
            href={`tel:${settings.phone}`}
            className="inline-block text-base font-black text-amber-600 hover:text-amber-700 font-display"
          >
            {settings.phone}
          </a>
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Official Email</h3>
          <p className="text-xs text-slate-500">For invoices, business queries, and feedback.</p>
          <a
            href={`mailto:${settings.email}`}
            className="inline-block text-sm font-bold text-amber-600 hover:underline break-all"
          >
            {settings.email}
          </a>
        </div>

        {/* Operating Hours / Central Address */}
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Central Kitchen</h3>
          <p className="text-xs text-slate-500 line-clamp-2">{settings.address || 'Chandra Complex, Near Kanyapuram School, Wimberlygunj, Sri Vijayapuram, A & N Islands 744206'}</p>
          <p className="text-xs font-bold text-slate-800">
            Open 11:00 AM – 01:00 AM
          </p>
        </div>

        {/* Statutory License */}
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">FSSAI Certified</h3>
          <p className="text-xs text-slate-500">Government certified food safety compliance.</p>
          <p className="text-xs font-mono font-bold text-slate-900 tracking-wider">
            {settings.fssaiLicense}
          </p>
        </div>

      </div>

      {/* Main Two-Column Contact Form & Company Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Thank You, {name}!</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your message has been delivered to Mr Bun support desk. We will get back to you at <strong>{phone}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Send Us a Direct Message</h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill out the form below and we will respond within 30 minutes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9476088111"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Party & Catering Inquiry">🎉 Party &amp; Catering Inquiry</option>
                    <option value="Live Order Feedback">🍔 Food Quality / Order Feedback</option>
                    <option value="Franchise Opportunity">💼 Franchise / Business Opportunity</option>
                    <option value="General Question">❓ General Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How can we help you?
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirement, event date, guest count, or feedback..."
                  rows={4}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Mr Bun</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Fast Contact & Company Badge (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-amber-500 to-red-600 rounded-3xl p-8 text-white shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={`${settings.brandName} Logo`}
                className="w-14 h-14 object-contain rounded-2xl bg-white p-1 shadow-md"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              <div>
                <h3 className="text-2xl font-black font-display">{settings.brandName}</h3>
                <p className="text-xs text-amber-100">{settings.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-amber-100 leading-relaxed">
              Prefer speaking with a human directly? Reach our dedicated catering manager or store supervisor instantly:
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="w-full bg-white text-slate-900 hover:bg-amber-50 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Call Directly: {settings.phone}</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="w-full bg-black/20 text-white hover:bg-black/30 font-bold py-3 px-4 rounded-xl text-xs border border-white/20 flex items-center justify-center gap-2 transition"
              >
                <Mail className="w-4 h-4" />
                <span>Email: {settings.email}</span>
              </a>
            </div>

            <div className="pt-3 border-t border-white/20 text-[11px] text-amber-100 space-y-1">
              <p>🏢 <strong>Company:</strong> {settings.brandName}</p>
              <p>📍 <strong>Central Location:</strong> {settings.address || 'Chandra Complex, Near Kanyapuram School, Wimberlygunj, Sri Vijayapuram, A & N Islands 744206'}</p>
              <p>🛡️ <strong>FSSAI License:</strong> {settings.fssaiLicense}</p>
            </div>
          </div>

          {/* Quick FAQ accordion preview */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="text-xs space-y-0.5 border-b border-slate-100 pb-2.5">
                  <p className="font-bold text-slate-800">{faq.q}</p>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactPage;
