import { FranchiseModel } from '../types';

export const INITIAL_FRANCHISE_MODELS: FranchiseModel[] = [
  {
    id: 'fran-model-1',
    title: 'Express Delivery & Takeaway Hub',
    badge: 'Low Capex • Quick Launch',
    area: '250 – 450 sq ft',
    investment: '₹12 – 18 Lakhs',
    roi: '10 – 14 Months',
    desc: 'Optimized for high-density delivery orders, online aggregators, and quick takeaway counters.',
    highlights: [
      'Compact commercial kitchen',
      'Low rental footprint',
      'Online order dispatch engine',
      '2-3 staff operation'
    ],
    orderIndex: 1,
    isActive: true
  },
  {
    id: 'fran-model-2',
    title: 'Flagship Diner & Cafe',
    badge: 'High Footfall • Maximum Revenue',
    area: '800 – 1,500 sq ft',
    investment: '₹28 – 40 Lakhs',
    roi: '14 – 18 Months',
    desc: 'Full-fledged experiential fast food diner with live pizza ovens, smash burger counter & party space.',
    highlights: [
      '50+ seating dine-in area',
      'Private party & birthday zone',
      'Instagrammable interiors',
      'High ticket dine-in + delivery'
    ],
    orderIndex: 2,
    isActive: true
  },
  {
    id: 'fran-model-3',
    title: 'Mall Food Court Kiosk',
    badge: 'Guaranteed Footfall',
    area: '150 – 300 sq ft',
    investment: '₹18 – 25 Lakhs',
    roi: '12 – 15 Months',
    desc: 'High velocity counter in prime shopping malls, tech parks, or transit hubs with rapid customer turnaround.',
    highlights: [
      'Pre-set mall infrastructure',
      'Instant brand visibility',
      'High margin combo meal sales',
      'Standardized plug-and-play setup'
    ],
    orderIndex: 3,
    isActive: true
  }
];
