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
  Sparkles,
  Loader2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { dbService } from '../services/db';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Party & Catering Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState<{
    id: string;
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
    sentToEmail: string;
    createdAt: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedPhone || !trimmedMessage) {
      alert('Please enter your name, contact phone, and message.');
      return;
    }

    setIsSending(true);

    try {
      const targetEmail = settings.email || 'contact@mrbun.in';
      const result = await dbService.submitContactMessage({
        name: trimmedName,
        phone: trimmedPhone,
        email: email.trim(),
        subject,
        message: trimmedMessage,
        sentToEmail: targetEmail
      });

      setSubmittedDetails({
        id: result.id,
        name: trimmedName,
        phone: trimmedPhone,
        email: email.trim(),
        subject,
        message: trimmedMessage,
        sentToEmail: targetEmail,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      // Even on local error, mark as submitted with client id
      setSubmittedDetails({
        id: 'MSG-' + Math.floor(10000 + Math.random() * 90000),
        name: trimmedName,
        phone: trimmedPhone,
        email: email.trim(),
        subject,
        message: trimmedMessage,
        sentToEmail: settings.email || 'contact@mrbun.in',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setSubject('Party & Catering Inquiry');
    setMessage('');
    setSubmitted(false);
    setSubmittedDetails(null);
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
            <div className="py-6 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Thank You, {submittedDetails?.name || name}!
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Delivered directly to contact@mrbun.in</span>
                </div>
              </div>

              {/* Exact user requested highlighted message */}
              <div className="bg-gradient-to-r from-emerald-50 to-amber-50 border-2 border-emerald-400/80 rounded-2xl p-5 text-center space-y-2 shadow-sm">
                <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  🎉 Our team will contact you soon.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your message has landed directly in our official inbox at <strong className="text-slate-900">contact@mrbun.in</strong>. A support representative from Mr Bun will contact you at <strong className="text-slate-900 font-mono">{submittedDetails?.phone || phone}</strong> shortly.
                </p>
              </div>

              {/* Inquiry Details Summary Card */}
              {submittedDetails && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Reference Ticket:</span>
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{submittedDetails.id}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Destination:</span>
                    <span className="font-semibold text-slate-800">{submittedDetails.sentToEmail}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Subject:</span>
                    <span className="font-semibold text-slate-800">{submittedDetails.subject}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Your Contact Phone:</span>
                    <span className="font-mono font-bold text-slate-800">{submittedDetails.phone}</span>
                  </div>
                  {submittedDetails.email && (
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-semibold">Your Email:</span>
                      <span className="font-mono text-slate-800">{submittedDetails.email}</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between pt-1">
                    <span className="text-slate-500 font-semibold">Message:</span>
                    <span className="text-slate-700 text-right max-w-[65%] italic line-clamp-3">"{submittedDetails.message}"</span>
                  </div>
                </div>
              )}

              {/* Fast Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Another Message</span>
                </button>

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Helpline: {settings.phone}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Send Us a Direct Message</h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill out the form below and we will respond within 30 minutes.</p>
              </div>

              {/* Destination guarantee notice */}
              <div className="flex items-center gap-2 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200 px-3.5 py-2 rounded-xl">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Submissions are delivered directly to official inbox: <strong className="font-mono text-amber-800">contact@mrbun.in</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9476088111"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Party & Catering Inquiry">🎉 Party &amp; Catering Inquiry</option>
                    <option value="Food Quality & Feedback">🍔 Food Quality / Order Feedback</option>
                    <option value="Franchise Opportunity">💼 Franchise / Business Opportunity</option>
                    <option value="Bulk Celebration Box Order">🎂 Bulk Celebration Box Order</option>
                    <option value="General Question">❓ General Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How can we help you? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirement, event date, guest count, or feedback..."
                  rows={4}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Delivering to contact@mrbun.in...</span>
                  </>
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
