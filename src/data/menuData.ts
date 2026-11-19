import { Product } from '../types';

export const MENU_PRODUCTS: Product[] = [
  // --- BURGERS ---
  {
    id: 'b1',
    name: 'Mr Bun Classic Smash Burger',
    category: 'burgers',
    description: 'Our signature double-smashed spiced patty, melted yellow cheddar, caramelised onions, pickled gherkins, and secret Mr Bun smoky sauce in a butter-toasted brioche bun.',
    price: 189,
    originalPrice: 229,
    isVeg: false,
    spicyLevel: 1,
    rating: 4.9,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Bestseller', 'Chef Special'],
    options: {
      size: [
        { name: 'Single Patty', extraPrice: 0 },
        { name: 'Double Patty Deluxe', extraPrice: 60 },
        { name: 'Triple Monster Stack', extraPrice: 110 }
      ],
      crustOrBun: [
        { name: 'Classic Brioche Bun', extraPrice: 0 },
        { name: 'Sesame Charcoal Bun', extraPrice: 25 },
        { name: 'Garlic Butter Toasted', extraPrice: 20 }
      ],
      addCheeseBurst: 40,
      extraPattyOrTopping: 50
    }
  },
  {
    id: 'b2',
    name: 'Crispy Paneer Makhani Burger',
    category: 'burgers',
    description: 'Crispy spiced cottage cheese steak submerged in aromatic rich makhani gravy, topped with crunchy iceberg lettuce & mint mayo.',
    price: 179,
    originalPrice: 209,
    isVeg: true,
    spicyLevel: 2,
    rating: 4.8,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Pure Veg Delight'],
    options: {
      size: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Super Jumbo Patty', extraPrice: 50 }
      ],
      addCheeseBurst: 35
    }
  },
  {
    id: 'b3',
    name: 'The Boss Fiery Chicken Zinger',
    category: 'burgers',
    description: '100% whole chicken thigh marinated in Nashville spice blend, deep fried to golden crunch, layered with spicy jalapeño slaw and sriracha drip.',
    price: 219,
    originalPrice: 259,
    isVeg: false,
    spicyLevel: 3,
    rating: 4.9,
    reviewsCount: 412,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Hot & Spicy'],
    options: {
      size: [
        { name: 'Standard Zinger', extraPrice: 0 },
        { name: 'Double Crunchy Thigh', extraPrice: 80 }
      ],
      addCheeseBurst: 40
    }
  },
  {
    id: 'b4',
    name: 'Truffle Mushroom & Swiss Bun',
    category: 'burgers',
    description: 'Sautéed wild portobello mushrooms, creamy Swiss melted cheese, roasted garlic herb emulsion, and micro greens.',
    price: 199,
    originalPrice: 239,
    isVeg: true,
    spicyLevel: 0,
    rating: 4.7,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    isNew: true,
    tags: ['Gourmet Special']
  },

  // --- PIZZAS ---
  {
    id: 'p1',
    name: 'Mr Bun Signature Cheese Burst Pizza',
    category: 'pizzas',
    description: 'Hand-stretched sourdough base overflowing with molten mozzarella cream inside the crust, loaded with basil marinara and double yellow cheddar.',
    price: 329,
    originalPrice: 389,
    isVeg: true,
    spicyLevel: 0,
    rating: 5.0,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Cheese Burst', 'Crowd Favorite'],
    options: {
      size: [
        { name: 'Regular (8 inch - 4 Slices)', extraPrice: 0 },
        { name: 'Medium (10 inch - 6 Slices)', extraPrice: 120 },
        { name: 'Large Party (12 inch - 8 Slices)', extraPrice: 220 }
      ],
      crustOrBun: [
        { name: 'Cheese Burst Crust', extraPrice: 50 },
        { name: 'Classic Hand Tossed', extraPrice: 0 },
        { name: 'Thin & Crispy Wheat Base', extraPrice: 20 }
      ],
      addCheeseBurst: 50,
      extraPattyOrTopping: 45
    }
  },
  {
    id: 'p2',
    name: 'Fiery BBQ Smoked Chicken Pizza',
    category: 'pizzas',
    description: 'Tender pulled smoked barbecue chicken, charred red onions, bell peppers, fresh jalapeños, and sweet hickory BBQ swirl.',
    price: 359,
    originalPrice: 429,
    isVeg: false,
    spicyLevel: 2,
    rating: 4.9,
    reviewsCount: 298,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Bestseller Non-Veg'],
    options: {
      size: [
        { name: 'Regular (8 inch)', extraPrice: 0 },
        { name: 'Medium (10 inch)', extraPrice: 130 },
        { name: 'Large (12 inch)', extraPrice: 240 }
      ]
    }
  },
  {
    id: 'p3',
    name: 'Farmhouse Garden Fresh Pizza',
    category: 'pizzas',
    description: 'Fresh mushrooms, black kalamata olives, sweet golden corn, red paprika, diced capsicum and premium Italian herbs.',
    price: 299,
    originalPrice: 349,
    isVeg: true,
    spicyLevel: 1,
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    tags: ['Fresh Veggies'],
    options: {
      size: [
        { name: 'Regular (8 inch)', extraPrice: 0 },
        { name: 'Medium (10 inch)', extraPrice: 110 },
        { name: 'Large (12 inch)', extraPrice: 200 }
      ]
    }
  },
  {
    id: 'p4',
    name: 'Tandoori Paneer Tikka Feast Pizza',
    category: 'pizzas',
    description: 'Clay-oven spiced paneer tikka cubes, caramelized onion rings, coriander drizzle, tangy makhani pizza base sauce and mozzarella.',
    price: 339,
    originalPrice: 399,
    isVeg: true,
    spicyLevel: 2,
    rating: 4.9,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    tags: ['Desi Twist']
  },

  // --- SANDWICHES & WRAPS ---
  {
    id: 's1',
    name: 'The Triple Decker Club Grill',
    category: 'sandwiches',
    description: 'Three toasted multigrain bread layers packed with smoked chicken or roasted paneer, fried egg/cheese slice, tomato, crisp cucumber, and dijon mustard mayo.',
    price: 169,
    originalPrice: 199,
    isVeg: false,
    spicyLevel: 1,
    rating: 4.8,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Heavy Filler'],
    options: {
      crustOrBun: [
        { name: 'Multigrain Sourdough', extraPrice: 0 },
        { name: 'Cheesy Garlic Bread', extraPrice: 30 }
      ],
      addCheeseBurst: 35
    }
  },
  {
    id: 's2',
    name: 'Bombay Street Masala Cheese Toastie',
    category: 'sandwiches',
    description: 'Spiced buttery potato mixture, green chutney, chopped onions, tomatoes, chaat masala, and a mountain of grated Amul cheese toasted crisp.',
    price: 139,
    originalPrice: 169,
    isVeg: true,
    spicyLevel: 2,
    rating: 4.9,
    reviewsCount: 275,
    image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80',
    tags: ['Street Icon']
  },
  {
    id: 's3',
    name: 'Crispy Zesty Falafel & Hummus Wrap',
    category: 'sandwiches',
    description: 'Herbed chickpea falafel discs rolled in warm Lebanese flatbread with tahini dip, creamy garlic hummus, and pickled beet shreds.',
    price: 159,
    originalPrice: 189,
    isVeg: true,
    spicyLevel: 1,
    rating: 4.7,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    isNew: true
  },

  // --- MOCKTAILS & BEVERAGES ---
  {
    id: 'm1',
    name: 'Electric Blue Lagoon Mocktail',
    category: 'mocktails',
    description: 'Refreshing Curacao citrus zest, bubbly soda, lemon juice, crushed mint, and chilled sparkling ice with lemon wheel.',
    price: 119,
    originalPrice: 149,
    isVeg: true,
    rating: 4.9,
    reviewsCount: 390,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Chilled Refresher']
  },
  {
    id: 'm2',
    name: 'Cuban Mint & Lime Virgin Mojito',
    category: 'mocktails',
    description: 'Hand-muddled fresh garden mint leaves, raw cane sugar syrup, tangy lime slices topped with fizzy club soda.',
    price: 109,
    originalPrice: 139,
    isVeg: true,
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    id: 'm3',
    name: 'Spicy Mango Chilli Fizz',
    category: 'mocktails',
    description: 'Alphonso mango nectar shaken with crushed bird eye chilli rim, rock salt, lime juice, and sparkling soda.',
    price: 129,
    originalPrice: 159,
    isVeg: true,
    spicyLevel: 1,
    rating: 4.8,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    isNew: true,
    tags: ['Party Favorite']
  },
  {
    id: 'm4',
    name: 'Belgian Choco Hazelnut Thick Shake',
    category: 'mocktails',
    description: 'Pure dairy ice cream blended with dark Belgian cocoa, roasted hazelnut crunch, topped with whipped cream and chocolate fudge drizzle.',
    price: 159,
    originalPrice: 189,
    isVeg: true,
    rating: 5.0,
    reviewsCount: 460,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },

  // --- SIDES & DESSERTS ---
  {
    id: 'sd1',
    name: 'Cheesy Peri Peri Loaded Crinkle Fries',
    category: 'sides',
    description: 'Golden crinkle cut potato fries tossed in African peri peri seasoning, drenched with molten cheddar and jalapeño dip.',
    price: 129,
    originalPrice: 159,
    isVeg: true,
    spicyLevel: 2,
    rating: 4.9,
    reviewsCount: 440,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    id: 'sd2',
    name: 'Stuffed Garlic Breadsticks with Cheese',
    category: 'sides',
    description: 'Freshly baked buttery garlic dough filled with melted mozzarella, sweet corn kernels, and green chilies.',
    price: 139,
    originalPrice: 169,
    isVeg: true,
    rating: 4.8,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sd3',
    name: 'Molten Choco Lava Bun Cake',
    category: 'sides',
    description: 'Warm fluffy chocolate bun cake with a piping-hot river of gooey dark chocolate inside.',
    price: 119,
    originalPrice: 139,
    isVeg: true,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    tags: ['Sweet Finale']
  },

  // --- COMBOS & FEASTS ---
  {
    id: 'cb1',
    name: 'Mr Bun Mega Gamer Combo',
    category: 'combos',
    description: '1 Classic Smash Burger + 1 Medium Cheese Burst Pizza + 1 Peri Peri Fries + 2 Mocktails of your choice.',
    price: 649,
    originalPrice: 799,
    isVeg: false,
    rating: 5.0,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tags: ['Save ₹150', 'Best Value Combo']
  },
  {
    id: 'cb2',
    name: 'Party Starter Veggie Platter',
    category: 'combos',
    description: '2 Crispy Paneer Burgers + 1 Farmhouse Pizza (10") + 1 Cheesy Garlic Bread + 2 Virgin Mojitos.',
    price: 699,
    originalPrice: 849,
    isVeg: true,
    rating: 4.9,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['Family Pack']
  }
];
