export interface ProductFlavor {
  id: 'chocolate' | 'vanilla' | 'elaichi' | 'wholesale';
  name: string;
  tagline: string;
  description: string;
  color: string;
  badgeColor: string;
  image: string;
  capacity: string;
  heatResistance: string;
  leakProofTime: string;
  tasteNotes: string[];
  bestPairedWith: string[];
  pricePerUnitEstimated?: string;
}

export const BRAND_DETAILS = {
  name: 'Cup2Eat',
  tagline: 'EAT YOUR DRINK!',
  founder: 'Varun Khera',
  phone: '9818192575',
  phoneDisplay: '+91 98181 92575',
  whatsappNumber: '919818192575',
  email: 'Varunkhera6@gmail.com',
  instagramHandle: '@cup2eat',
  instagramUrl: 'https://www.instagram.com/cup2eat/',
  fssaiRegNo: 'FSSAI Registered Wholesaler & Retailer',
  fssaiLocation: 'Ghaziabad, Uttar Pradesh, India',
  promotionalWholesale: {
    quantity: 396,
    price: 3999,
    formattedPrice: '₹3,999',
    capacity: '100 ml',
    flavorsIncluded: ['Chocolate', 'Vanilla', 'Elaichi'],
    shipping: 'Free Pan-India Delivery Included',
    disclaimer: 'Observed promotional offer. Contact for current availability and bulk contract quotes.',
  },
};

export const FLAVORS: ProductFlavor[] = [
  {
    id: 'chocolate',
    name: 'Chocolate Edible Cup',
    tagline: 'Rich Cocoa Crunch for Espresso & Desserts',
    description: 'Crafted with premium cocoa and a golden crispy waffle weave. Retains hot liquids up to 85°C while staying deliciously crisp. Conclude your coffee with a rich chocolate brownie bite.',
    color: '#3D2314',
    badgeColor: 'bg-[#3D2314] text-[#FFF4D6]',
    image: '/src/assets/images/flavor_chocolate_cup_1794364085690.jpg',
    capacity: '100 ml',
    heatResistance: 'Up to 85°C',
    leakProofTime: '45+ Minutes',
    tasteNotes: ['Dark Cocoa', 'Crispy Waffle', 'Subtle Toast'],
    bestPairedWith: ['Espresso & Cappuccino', 'Hot Chocolate', 'Vanilla Ice Cream', 'Brownie Sundaes'],
  },
  {
    id: 'vanilla',
    name: 'Vanilla Edible Cup',
    tagline: 'Subtle Sweetness Perfect for Tea & Latte',
    description: 'Infused with natural vanilla aroma and baked to golden waffle perfection. Provides a gentle, balanced sweetness that complements specialty teas, lattes, and artisan dessert shots.',
    color: '#D9A52B',
    badgeColor: 'bg-[#D9A52B] text-[#073B2B]',
    image: '/src/assets/images/flavor_vanilla_cup_1794364085246.jpg',
    capacity: '100 ml',
    heatResistance: 'Up to 85°C',
    leakProofTime: '45+ Minutes',
    tasteNotes: ['Pure Vanilla Bean', 'Golden Honey Waffle', 'Warm Butter'],
    bestPairedWith: ['Chai Latte', 'Earl Grey Tea', 'Gelato Shots', 'Matcha Latte'],
  },
  {
    id: 'elaichi',
    name: 'Elaichi (Cardamom) Edible Cup',
    tagline: 'Aromatic Spice Infused for Indian Chai',
    description: 'Specially developed for authentic Indian tea lovers. Real green cardamom notes baked directly into the crisp container, creating an unforgettable sensory pairing with hot masala chai.',
    color: '#073B2B',
    badgeColor: 'bg-[#073B2B] text-[#F2B544]',
    image: '/src/assets/images/flavor_elaichi_cup_1794364086233.jpg',
    capacity: '100 ml',
    heatResistance: 'Up to 85°C',
    leakProofTime: '45+ Minutes',
    tasteNotes: ['Green Cardamom', 'Spiced Crust', 'Artisan Grain'],
    bestPairedWith: ['Adrak Masala Chai', 'Cutting Chai', 'Kesar Milk', 'Festival Desserts'],
  },
];

export const BUSINESS_SOLUTIONS = [
  {
    id: 'cafes',
    title: 'Cafés & Specialty Coffee',
    description: 'Transform routine coffee orders into viral social media moments. Serve espresso shots, lattes, and mocha in chocolate cups that guests love sharing.',
    icon: 'Coffee',
    benefit: '+40% Social Media Engagement',
  },
  {
    id: 'tea-lounges',
    title: 'Tea Shops & Chai Outlets',
    description: 'Elevate traditional chai with our Elaichi cardamom edible cup. Eliminate single-use paper cups while offering an authentic spiced crunch after drinking.',
    icon: 'Teacup',
    benefit: 'Zero Cup Disposal Cost',
  },
  {
    id: 'dessert-parlours',
    title: 'Ice Cream & Dessert Lounges',
    description: 'Serve gelato, mousse, or warm brownie sundaes inside edible cups. A crisp, edible vessel that enhances dessert presentation.',
    icon: 'IceCream',
    benefit: 'Unique Signature Dessert',
  },
  {
    id: 'events-catering',
    title: 'Events, Catering & Weddings',
    description: 'Make weddings, corporate expos, and private banquets memorable. Stand out with zero-waste beverage and dessert stations.',
    icon: 'Sparkles',
    benefit: 'Memorable Guest Experience',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How long does a Cup2Eat edible cup hold hot liquids without leaking?',
    answer: 'Cup2Eat cups are engineered to hold hot beverages (up to 85°C like hot chai or coffee) for 45+ minutes without leaking, softening prematurely, or losing their structural integrity.',
  },
  {
    question: 'What are the available sizes and flavours?',
    answer: 'Our signature cups come in a 100 ml capacity and are available in three delicious flavours: Chocolate, Vanilla, and Elaichi (Cardamom). We also offer wholesale mixed box assortments.',
  },
  {
    question: 'What is the wholesale package deal?',
    answer: 'Our popular promotional wholesale offer is 396 edible 100ml cups for ₹3,999 with Pan-India delivery included. You receive an assortment of Chocolate, Vanilla, and Elaichi flavours.',
  },
  {
    question: 'Are Cup2Eat cups safe and licensed?',
    answer: 'Yes! Cup2Eat is FSSAI registered (Wholesaler & Retailer) based in Ghaziabad, Uttar Pradesh. Our products are made under strict hygiene standards using food-grade ingredients.',
  },
  {
    question: 'How do I place an order for my cafe or event?',
    answer: 'You can easily place an enquiry or order by clicking our WhatsApp buttons, filling out the contact form on this site, or contacting founder Varun Khera directly at 9818192575 or Varunkhera6@gmail.com.',
  },
  {
    question: 'How long can Cup2Eat edible cups be stored?',
    answer: 'When stored in a dry, cool place away from direct moisture, Cup2Eat edible cups have a long shelf life. Every wholesale order comes in protective moisture-barrier packaging.',
  },
];
