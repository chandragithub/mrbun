import { PartyPackage } from '../types';

export const PARTY_PACKAGES: PartyPackage[] = [
  {
    id: 'pkg-birthday',
    title: 'Birthday Bash Mega Feast',
    tagline: 'Ideal for 15 to 60+ guests! Bursting with burgers, pizzas, fries, mocktails & cake.',
    minGuests: 15,
    pricePerGuest: 299,
    badge: 'Most Popular for Birthdays',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'Birthday celebrations, kids parties, anniversaries',
    includes: [
      'Choice of 2 Gourmet Burgers (Veg / Non-Veg options)',
      'Assorted Medium Cheese Burst Pizzas (Fresh slices for all)',
      'Crispy Peri Peri Crinkle Fries platters',
      'Unlimited Chilled Mocktails (Virgin Mojito & Blue Lagoon)',
      'Complimentary Birthday Mascot Banner & Party Hats',
      'Special Choco Lava dessert treats for each guest'
    ],
    popularItems: ['Classic Smash Burger', 'Cheese Burst Pizza', 'Electric Blue Lagoon', 'Peri Peri Fries']
  },
  {
    id: 'pkg-corporate',
    title: 'Corporate & Office Hangout Platter',
    tagline: 'Hassle-free, individually packed meal boxes for office teams, hackathons & meetings.',
    minGuests: 20,
    pricePerGuest: 249,
    badge: 'GST Invoice Included',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'Office lunches, product launches, corporate team gatherings',
    includes: [
      'Individual Bento Box: 1 Signature Burger + 1 Slice Pizza + 1 Dip',
      'Portion of Golden Salted Fries & Garlic Dip',
      'Choice of Cold Coffee or Virgin Mojito (Bottled)',
      'Eco-friendly cutlery, napkins & wet wipes',
      'Timely bulk slot delivery with temperature-controlled warming boxes',
      'Dedicated corporate billing & GST compliance'
    ],
    popularItems: ['Paneer Makhani Burger', 'Triple Decker Sandwich', 'Cold Coffee']
  },
  {
    id: 'pkg-house-party',
    title: 'House Party & Game Night Craze',
    tagline: 'Ultimate bite-sized finger foods, sliders & large pizzas for your friends hangout.',
    minGuests: 10,
    pricePerGuest: 269,
    badge: 'Late Night Available',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'Cricket/Football match screenings, weekend sleepovers, board game nights',
    includes: [
      'Tower of Mini Bun Sliders (Veg & Non-Veg mix)',
      '12-inch Extra Large Pizzas (Smoked BBQ Chicken & Farmhouse)',
      'Loaded Cheese Nachos & Cheesy Breadsticks',
      'Jumbo Pitchers of Mango Chilli Fizz & Blue Lagoon Mocktails',
      'Extra signature Mr Bun dip bottles (Truffle Mayo, Hot Sriracha)'
    ],
    popularItems: ['Fiery BBQ Chicken Pizza', 'Loaded Fries', 'Blue Lagoon', 'Tandoori Paneer Pizza']
  },
  {
    id: 'pkg-custom',
    title: 'Custom VIP Event Buffet',
    tagline: 'Design your own live counter, custom menu items, and chef setup at your venue.',
    minGuests: 30,
    pricePerGuest: 349,
    badge: 'Customizable Counter',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'College farewells, weddings after-parties, grand reunions',
    includes: [
      'Live Mr Bun Toasting & Slicing Station at venue',
      'Unlimited combinations of 4 Burgers, 3 Pizzas & 3 Mocktails',
      '2 Uniformed Mr Bun service crew to serve guests hot & fresh',
      'Customized welcome food cards with your event name',
      'Zero cleanup hassle: complete disposable setup handled'
    ],
    popularItems: ['Live Burger Counter', 'Custom Mocktail Bar', 'Cheese Fountains']
  }
];
