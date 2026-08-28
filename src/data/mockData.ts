import { Product, Client, Order, CustomerInquiry, InventoryLog } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'HT-LIV-SOF-001',
    name: 'Oslo 3-Seater Fluted Velvet Sofa',
    category: 'Living Room',
    subCategory: 'Sofas & Couches',
    price: 1299,
    compareAtPrice: 1599,
    costPrice: 620,
    stock: 14,
    minStockThreshold: 5,
    material: 'Premium Italian Velvet & Kiln-Dried Pine Wood',
    finish: 'Warm Sand Beige',
    dimensions: { widthCm: 220, depthCm: 92, heightCm: 84 },
    weightKg: 58,
    roomType: 'Living Room',
    assemblyRequired: false,
    warrantyYears: 5,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The Oslo 3-Seater Sofa combines Scandinavian minimalism with supreme lounging comfort. Features high-density foam with feather-blend toppers.',
    warehouse: 'Central Warehouse - Hub A',
    tags: ['Scandinavian', 'Velvet', 'Living Room', 'Best Seller'],
    rating: 4.9,
    salesCount: 142,
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-2',
    sku: 'HT-DIN-TBL-002',
    name: 'Valhalla 8-Seater Solid Sheesham Dining Table',
    category: 'Dining Room',
    subCategory: 'Dining Tables',
    price: 1450,
    compareAtPrice: 1750,
    costPrice: 710,
    stock: 6,
    minStockThreshold: 8, // Triggers low stock alert
    material: '100% Solid Sheesham (Indian Rosewood)',
    finish: 'Honey Walnut Polish',
    dimensions: { widthCm: 210, depthCm: 100, heightCm: 76 },
    weightKg: 72,
    roomType: 'Dining Room',
    assemblyRequired: true,
    warrantyYears: 10,
    status: 'Low Stock',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Handcrafted from kiln-seasoned Sheesham timber, displaying expressive grain patterns with beveled edge profiles.',
    warehouse: 'North Hub - Sector 4',
    tags: ['Solid Wood', 'Dining', 'Handcrafted', 'Heirloom'],
    rating: 4.8,
    salesCount: 88,
    createdAt: '2026-01-20'
  },
  {
    id: 'prod-3',
    sku: 'HT-BED-KNG-003',
    name: 'Kyoto King Storage Bed with Fluted Headboard',
    category: 'Bedroom',
    subCategory: 'Beds & Frames',
    price: 1680,
    compareAtPrice: 1999,
    costPrice: 850,
    stock: 9,
    minStockThreshold: 4,
    material: 'FSC Certified White Oak & Linen Upholstery',
    finish: 'Natural Matte Muted Oak',
    dimensions: { widthCm: 195, depthCm: 215, heightCm: 110 },
    weightKg: 95,
    roomType: 'Bedroom',
    assemblyRequired: true,
    warrantyYears: 7,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Japandi aesthetic platform bed featuring hydraulic gas-lift under-bed storage and acoustic fluted acoustic fabric headboard.',
    warehouse: 'Central Warehouse - Hub A',
    tags: ['Japandi', 'Storage Bed', 'Oak', 'Hydraulic'],
    rating: 4.95,
    salesCount: 65,
    createdAt: '2026-02-01'
  },
  {
    id: 'prod-4',
    sku: 'HT-LIV-ARM-004',
    name: 'Verona Sculptural Bouclé Lounge Armchair',
    category: 'Living Room',
    subCategory: 'Chairs & Recliners',
    price: 649,
    compareAtPrice: 799,
    costPrice: 280,
    stock: 22,
    minStockThreshold: 6,
    material: 'Textured Bouclé Fabric & Matte Black Steel Frame',
    finish: 'Ivory Cream',
    dimensions: { widthCm: 84, depthCm: 82, heightCm: 78 },
    weightKg: 24,
    roomType: 'Living Room',
    assemblyRequired: false,
    warrantyYears: 3,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Curved cocoon silhouette in tactile teddy bouclé. Engineered with ergonomics that cradle the lumbar perfectly.',
    warehouse: 'West Depot - Unit 2',
    tags: ['Boucle', 'Armchair', 'Modern', 'Accent'],
    rating: 4.7,
    salesCount: 194,
    createdAt: '2026-02-10'
  },
  {
    id: 'prod-5',
    sku: 'HT-DEC-COF-005',
    name: 'Artisanal Travertine & Fluted Brass Coffee Table',
    category: 'Living Room',
    subCategory: 'Coffee Tables',
    price: 890,
    compareAtPrice: 1100,
    costPrice: 420,
    stock: 3,
    minStockThreshold: 5, // Triggers low stock alert
    material: 'Natural Roman Travertine Stone & Brushed Antique Brass',
    finish: 'Honed Matte Stone',
    dimensions: { widthCm: 110, depthCm: 110, heightCm: 38 },
    weightKg: 64,
    roomType: 'Living Room',
    assemblyRequired: false,
    warrantyYears: 5,
    status: 'Low Stock',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Each piece features organic porous variations native to authentic travertine marble. Sealed with food-safe nano protection.',
    warehouse: 'Central Warehouse - Hub A',
    tags: ['Travertine', 'Marble', 'Luxury', 'Organic'],
    rating: 4.9,
    salesCount: 52,
    createdAt: '2026-02-12'
  },
  {
    id: 'prod-6',
    sku: 'HT-LGT-PEN-006',
    name: 'Aura Spun Brass & Frosted Glass Pendant Chandelier',
    category: 'Lighting',
    subCategory: 'Pendant Lights',
    price: 320,
    compareAtPrice: 420,
    costPrice: 130,
    stock: 35,
    minStockThreshold: 10,
    material: 'Heavy-Gauge Spun Brass & Opal Mouth-Blown Glass',
    finish: 'Satin Brushed Gold',
    dimensions: { widthCm: 65, depthCm: 65, heightCm: 120 },
    weightKg: 8.5,
    roomType: 'Dining & Foyer',
    assemblyRequired: true,
    warrantyYears: 3,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Warm, glare-free diffused ambient illumination with adjustable brass drop rods and dimmable warm LED module.',
    warehouse: 'South Depot - Bay 1',
    tags: ['Lighting', 'Brass', 'Pendant', 'Modern Glass'],
    rating: 4.85,
    salesCount: 210,
    createdAt: '2026-01-08'
  },
  {
    id: 'prod-7',
    sku: 'HT-STU-DSK-007',
    name: 'Geneva Executive Walnut Desk with Wireless Charging',
    category: 'Study & Office',
    subCategory: 'Desks & Workstations',
    price: 1150,
    compareAtPrice: 1390,
    costPrice: 530,
    stock: 0,
    minStockThreshold: 4, // Out of stock
    material: 'American Solid Walnut & Vegan Leather Pad Inset',
    finish: 'Satin Dark Walnut',
    dimensions: { widthCm: 160, depthCm: 75, heightCm: 76 },
    weightKg: 46,
    roomType: 'Home Office',
    assemblyRequired: true,
    warrantyYears: 5,
    status: 'Out of Stock',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Integrated cable routing trench, magnetic soft-close drawers, and concealed 15W Qi wireless fast-charging pad.',
    warehouse: 'North Hub - Sector 4',
    tags: ['Executive', 'Office', 'Walnut', 'Tech Integrated'],
    rating: 4.75,
    salesCount: 78,
    createdAt: '2026-01-25'
  },
  {
    id: 'prod-8',
    sku: 'HT-DEC-MRR-008',
    name: 'Solstice Grand Arched Solid Brass Floor Mirror',
    category: 'Decor & Accents',
    subCategory: 'Mirrors',
    price: 480,
    compareAtPrice: 590,
    costPrice: 190,
    stock: 18,
    minStockThreshold: 6,
    material: 'HD Copper-Free Silver Mirror & Hand-Forged Brass Edge',
    finish: 'Brushed Antique Brass',
    dimensions: { widthCm: 90, depthCm: 4, heightCm: 200 },
    weightKg: 28,
    roomType: 'Bedroom & Entryway',
    assemblyRequired: false,
    warrantyYears: 5,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Full-length architectural arched mirror engineered with shatter-proof film and floor-standing kickstand or wall mounting brackets.',
    warehouse: 'Central Warehouse - Hub A',
    tags: ['Mirror', 'Arched', 'Decor', 'Brass'],
    rating: 4.9,
    salesCount: 160,
    createdAt: '2026-02-05'
  },
  {
    id: 'prod-9',
    sku: 'HT-DIN-CHR-009',
    name: 'Sora Woven Cane & Teak Wood Dining Chair (Set of 2)',
    category: 'Dining Room',
    subCategory: 'Dining Chairs',
    price: 520,
    compareAtPrice: 650,
    costPrice: 210,
    stock: 28,
    minStockThreshold: 8,
    material: 'Reclaimed Teak Wood & Natural Hand-Woven Rattan Cane',
    finish: 'Caramel Teak Oil',
    dimensions: { widthCm: 52, depthCm: 56, heightCm: 82 },
    weightKg: 14,
    roomType: 'Dining Room',
    assemblyRequired: false,
    warrantyYears: 3,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Classic mid-century Pierre Jeanneret inspired V-leg silhouette with breathable octagonal rattan weave.',
    warehouse: 'West Depot - Unit 2',
    tags: ['Cane', 'Teak', 'Mid-Century', 'Dining Chair'],
    rating: 4.8,
    salesCount: 310,
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-10',
    sku: 'HT-OUT-SET-010',
    name: 'Monaco Teak & Sunbrella 4-Piece Outdoor Lounge Set',
    category: 'Outdoor',
    subCategory: 'Outdoor Sets',
    price: 2450,
    compareAtPrice: 2899,
    costPrice: 1180,
    stock: 5,
    minStockThreshold: 4,
    material: 'Grade-A Plantation Teak & All-Weather Sunbrella® Fabric',
    finish: 'Weathered Natural Silver Patina',
    dimensions: { widthCm: 240, depthCm: 180, heightCm: 72 },
    weightKg: 110,
    roomType: 'Balcony & Patio',
    assemblyRequired: true,
    warrantyYears: 5,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Weather-resistant, UV-inhibited, quick-dry foam cushions paired with sustainably harvested marine-grade teak.',
    warehouse: 'South Depot - Bay 1',
    tags: ['Outdoor', 'Patio', 'Teak', 'Sunbrella'],
    rating: 4.9,
    salesCount: 34,
    createdAt: '2026-02-14'
  },
  {
    id: 'prod-11',
    sku: 'HT-KTC-CRT-011',
    name: 'Provence Granite-Top Mobile Kitchen Cart & Wine Island',
    category: 'Kitchen & Dining',
    subCategory: 'Kitchen Islands',
    price: 799,
    compareAtPrice: 950,
    costPrice: 350,
    stock: 12,
    minStockThreshold: 5,
    material: 'Black Pearl Granite Slab & Solid Birch Base',
    finish: 'Sage Green Matte Lacquer',
    dimensions: { widthCm: 120, depthCm: 60, heightCm: 90 },
    weightKg: 54,
    roomType: 'Kitchen',
    assemblyRequired: true,
    warrantyYears: 5,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Heavy duty lockable industrial casters, slotted 12-bottle wine rack, solid brass towel bars, and utensil drawer.',
    warehouse: 'North Hub - Sector 4',
    tags: ['Kitchen', 'Granite', 'Island', 'Storage'],
    rating: 4.7,
    salesCount: 89,
    createdAt: '2026-02-08'
  },
  {
    id: 'prod-12',
    sku: 'HT-DEC-VAS-012',
    name: 'Artisan Terracotta & Ribbed Ceramic Vessel Collection (Set of 3)',
    category: 'Decor & Accents',
    subCategory: 'Vases & Vessels',
    price: 145,
    compareAtPrice: 180,
    costPrice: 45,
    stock: 45,
    minStockThreshold: 15,
    material: 'Unglazed Hand-Thrown Terracotta & Matte Stoneware',
    finish: 'Earthy Sand & Terracotta',
    dimensions: { widthCm: 25, depthCm: 25, heightCm: 42 },
    weightKg: 6,
    roomType: 'Living & Dining',
    assemblyRequired: false,
    warrantyYears: 1,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Trio of organic architectural urns, water-tight glazed interior suitable for dried pampas or fresh floral stems.',
    warehouse: 'Central Warehouse - Hub A',
    tags: ['Ceramic', 'Terracotta', 'Decor', 'Vase'],
    rating: 4.95,
    salesCount: 420,
    createdAt: '2026-01-05'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Ananya Singhania',
    email: 'ananya.singhania@studiodesign.in',
    phone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    company: 'Singhania Luxury Interiors & Villa Studio',
    tier: 'VIP Interior Designer',
    addresses: [
      {
        label: 'Studio HQ / Site Office',
        street: 'Penthouse 4B, Signature Crest, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        isDefault: true
      },
      {
        label: 'Whitefield Villa Project Site',
        street: 'Villa 14, Prestige Golfshire Enclave',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '562110',
        isDefault: false
      }
    ],
    totalOrders: 6,
    totalSpent: 14850,
    lastOrderDate: '2026-02-24',
    registeredAt: '2025-08-10',
    notes: 'Premium commercial tier interior partner. Prefers warm honey walnut and bouclé finishes. Requires freight lift booking coordination for penthouse deliveries.',
    preferredStyle: 'Japandi & Minimalist Contemporary'
  },
  {
    id: 'client-2',
    name: 'Vikramaditya Oberoi',
    email: 'v.oberoi@oberoiholdings.com',
    phone: '+91 98110 32900',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    company: 'Oberoi Heritage Retreats',
    tier: 'Commercial Architect',
    addresses: [
      {
        label: 'Corporate Office',
        street: 'Level 12, Express Towers, Nariman Point',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400021',
        isDefault: true
      }
    ],
    totalOrders: 4,
    totalSpent: 11200,
    lastOrderDate: '2026-02-21',
    registeredAt: '2025-09-14',
    notes: 'Orders solid teak and sheesham sets for boutique resort properties. Often requests bulk tax invoicing (GST input credit).',
    preferredStyle: 'Solid Wood Heirloom & Mid-Century'
  },
  {
    id: 'client-3',
    name: 'Dr. Meera Nambiar',
    email: 'meera.nambiar.md@gmail.com',
    phone: '+91 97402 88120',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    tier: 'Residential High-Value',
    addresses: [
      {
        label: 'Primary Residence',
        street: '88 Palm Meadows Boulevard, Koramangala 3rd Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        isDefault: true
      }
    ],
    totalOrders: 3,
    totalSpent: 4280,
    lastOrderDate: '2026-02-18',
    registeredAt: '2025-11-05',
    notes: 'Furnishing complete duplex apartment. Highly values quick assembly support and eco-friendly packaging.',
    preferredStyle: 'Warm Scandinavian & Bouclé'
  },
  {
    id: 'client-4',
    name: 'Rohan & Tara Mehta',
    email: 'rohan.mehta@fintechventures.io',
    phone: '+91 99205 17822',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    tier: 'Residential High-Value',
    addresses: [
      {
        label: 'Sea Face Apartment',
        street: '18A Worli Sea Face Promenade',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400030',
        isDefault: true
      }
    ],
    totalOrders: 3,
    totalSpent: 3960,
    lastOrderDate: '2026-02-25',
    registeredAt: '2025-12-01',
    notes: 'Recently ordered Oslo sofa and Travertine coffee table. Inquired about matching side tables.',
    preferredStyle: 'Monochromatic Modern & Travertine'
  },
  {
    id: 'client-5',
    name: 'Kabir Varma',
    email: 'k.varma@varmaarchitects.org',
    phone: '+91 98711 60044',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    company: 'Studio Varma & Associates',
    tier: 'VIP Interior Designer',
    addresses: [
      {
        label: 'Design Studio',
        street: 'Sector 29, Golf Course Extension Road',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        isDefault: true
      }
    ],
    totalOrders: 5,
    totalSpent: 9840,
    lastOrderDate: '2026-02-26',
    registeredAt: '2025-10-18',
    notes: 'Regular designer partner. Requires CAD 3D models and fabric swatch kits for luxury residential client pitches.',
    preferredStyle: 'Mid-Century Teak & Modernist'
  },
  {
    id: 'client-6',
    name: 'Priyanka Sen',
    email: 'priyanka.sen@creativelabs.co',
    phone: '+91 98300 77412',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    tier: 'Retail Customer',
    addresses: [
      {
        label: 'Home Address',
        street: 'Flat 602, Ballygunge Circular Road',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700019',
        isDefault: true
      }
    ],
    totalOrders: 2,
    totalSpent: 965,
    lastOrderDate: '2026-02-15',
    registeredAt: '2026-01-11',
    notes: 'Loves lighting and artisanal vases. Subscribed to festive catalog previews.',
    preferredStyle: 'Boho & Brass Lighting'
  },
  {
    id: 'client-7',
    name: 'Siddharth Iyer',
    email: 'siddharth.iyer@iyercounsel.com',
    phone: '+91 94440 12899',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    tier: 'Retail Customer',
    addresses: [
      {
        label: 'Home Office / Chamber',
        street: '42 Poes Garden, Alwarpet',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600086',
        isDefault: true
      }
    ],
    totalOrders: 1,
    totalSpent: 1150,
    lastOrderDate: '2026-02-12',
    registeredAt: '2026-01-20',
    notes: 'Purchased Geneva Executive Walnut Desk. Extremely satisfied with wireless charging and cable tray.',
    preferredStyle: 'Executive Solid Wood'
  },
  {
    id: 'client-8',
    name: 'Esha & Karan Johar',
    email: 'esha.johar@urbanliving.com',
    phone: '+91 98199 43210',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    tier: 'Residential High-Value',
    addresses: [
      {
        label: 'Juhu Villa',
        street: '12 Gulmohar Cross Road 9, JVPD Scheme',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400049',
        isDefault: true
      }
    ],
    totalOrders: 2,
    totalSpent: 3340,
    lastOrderDate: '2026-02-23',
    registeredAt: '2026-01-28',
    notes: 'Furnishing private patio and master bedroom suite.',
    preferredStyle: 'Sunbrella Outdoor & Japandi'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'HT-ORD-2026-8941',
    clientId: 'client-1',
    clientName: 'Ananya Singhania',
    clientEmail: 'ananya.singhania@studiodesign.in',
    clientPhone: '+91 98201 44521',
    shippingAddress: {
      street: 'Villa 14, Prestige Golfshire Enclave',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '562110',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Oslo 3-Seater Fluted Velvet Sofa',
        sku: 'HT-LIV-SOF-001',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        category: 'Living Room',
        price: 1299,
        quantity: 2,
        customFinish: 'Warm Sand Beige - Scotchgard Coated'
      },
      {
        productId: 'prod-5',
        productName: 'Artisanal Travertine & Fluted Brass Coffee Table',
        sku: 'HT-DEC-COF-005',
        image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=80',
        category: 'Living Room',
        price: 890,
        quantity: 1
      },
      {
        productId: 'prod-4',
        productName: 'Verona Sculptural Bouclé Lounge Armchair',
        sku: 'HT-LIV-ARM-004',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
        category: 'Living Room',
        price: 649,
        quantity: 2
      }
    ],
    subtotal: 4786,
    shippingFee: 0,
    tax: 430.74,
    discount: 250,
    totalAmount: 4966.74,
    status: 'In Production / Carpentry',
    paymentStatus: 'Paid',
    paymentMethod: 'Wire Transfer',
    trackingNumber: 'HT-EXP-BLR-9982',
    courierService: 'HomeTown White-Glove Logistics',
    estimatedDelivery: '2026-03-05',
    placedAt: '2026-02-24T14:32:00Z',
    updatedAt: '2026-02-25T10:15:00Z',
    customerNotes: 'Please coordinate delivery with site supervisor Mr. Ramesh (+91 98450 11223). Ensure white-glove unboxing.',
    internalSellerNotes: 'High priority VIP client order. Velvet upholstery batch inspected and approved by master carpenter.',
    timeline: [
      { id: 'log-1', timestamp: '2026-02-24 14:32', status: 'Pending', description: 'Order received via Designer B2B Portal', actor: 'Client (Online)' },
      { id: 'log-2', timestamp: '2026-02-24 15:45', status: 'Confirmed', description: 'Wire transfer of $4,966.74 verified by Accounts', actor: 'Finance Admin' },
      { id: 'log-3', timestamp: '2026-02-25 10:15', status: 'Carpentry / Production', description: 'Moved to Carpentry & Upholstery bay for custom Scotchgard finish', actor: 'Production Lead' }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'HT-ORD-2026-8920',
    clientId: 'client-1',
    clientName: 'Ananya Singhania',
    clientEmail: 'ananya.singhania@studiodesign.in',
    clientPhone: '+91 98201 44521',
    shippingAddress: {
      street: 'Penthouse 4B, Signature Crest, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-3',
        productName: 'Kyoto King Storage Bed with Fluted Headboard',
        sku: 'HT-BED-KNG-003',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
        category: 'Bedroom',
        price: 1680,
        quantity: 1
      },
      {
        productId: 'prod-6',
        productName: 'Aura Spun Brass & Frosted Glass Pendant Chandelier',
        sku: 'HT-LGT-PEN-006',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
        category: 'Lighting',
        price: 320,
        quantity: 2
      }
    ],
    subtotal: 2320,
    shippingFee: 0,
    tax: 208.80,
    discount: 100,
    totalAmount: 2428.80,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    trackingNumber: 'HT-EXP-BLR-8841',
    courierService: 'HomeTown White-Glove Logistics',
    estimatedDelivery: '2026-02-14',
    placedAt: '2026-02-08T11:20:00Z',
    updatedAt: '2026-02-14T16:45:00Z',
    customerNotes: 'Please ensure installation technician arrives with electric screwdriver.',
    internalSellerNotes: 'Completed on-time. Client gave 5-star review for bed assembly.',
    timeline: [
      { id: 'log-10', timestamp: '2026-02-08 11:20', status: 'Confirmed', description: 'Order placed & paid', actor: 'Client' },
      { id: 'log-11', timestamp: '2026-02-11 09:00', status: 'Shipped', description: 'Dispatched from Hub A', actor: 'Warehouse Manager' },
      { id: 'log-12', timestamp: '2026-02-14 16:45', status: 'Delivered', description: 'Assembled in master bedroom. Signed by Ananya.', actor: 'Delivery Agent' }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'HT-ORD-2026-8902',
    clientId: 'client-1',
    clientName: 'Ananya Singhania',
    clientEmail: 'ananya.singhania@studiodesign.in',
    clientPhone: '+91 98201 44521',
    shippingAddress: {
      street: 'Penthouse 4B, Signature Crest, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Valhalla 8-Seater Solid Sheesham Dining Table',
        sku: 'HT-DIN-TBL-002',
        image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80',
        category: 'Dining Room',
        price: 1450,
        quantity: 1
      },
      {
        productId: 'prod-9',
        productName: 'Sora Woven Cane & Teak Wood Dining Chair (Set of 2)',
        sku: 'HT-DIN-CHR-009',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
        category: 'Dining Room',
        price: 520,
        quantity: 4
      }
    ],
    subtotal: 3530,
    shippingFee: 0,
    tax: 317.70,
    discount: 150,
    totalAmount: 3697.70,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Wire Transfer',
    trackingNumber: 'HT-EXP-BLR-7411',
    courierService: 'HomeTown White-Glove Logistics',
    estimatedDelivery: '2026-01-28',
    placedAt: '2026-01-20T09:15:00Z',
    updatedAt: '2026-01-28T14:10:00Z',
    customerNotes: 'Sheesham table polish to match sample walnut grain.',
    timeline: [
      { id: 'log-20', timestamp: '2026-01-20 09:15', status: 'Confirmed', description: 'Order booked', actor: 'Client' },
      { id: 'log-21', timestamp: '2026-01-28 14:10', status: 'Delivered', description: 'Delivered & dining chairs placed', actor: 'Delivery Agent' }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'HT-ORD-2026-8935',
    clientId: 'client-2',
    clientName: 'Vikramaditya Oberoi',
    clientEmail: 'v.oberoi@oberoiholdings.com',
    clientPhone: '+91 98110 32900',
    shippingAddress: {
      street: 'Level 12, Express Towers, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400021',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Valhalla 8-Seater Solid Sheesham Dining Table',
        sku: 'HT-DIN-TBL-002',
        image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80',
        category: 'Dining Room',
        price: 1450,
        quantity: 3
      },
      {
        productId: 'prod-9',
        productName: 'Sora Woven Cane & Teak Wood Dining Chair (Set of 2)',
        sku: 'HT-DIN-CHR-009',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
        category: 'Dining Room',
        price: 520,
        quantity: 12
      }
    ],
    subtotal: 10590,
    shippingFee: 150,
    tax: 953.10,
    discount: 500,
    totalAmount: 11193.10,
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Wire Transfer',
    trackingNumber: 'HT-TRK-MUM-4491',
    courierService: 'Express Freight Logistics',
    estimatedDelivery: '2026-02-28',
    placedAt: '2026-02-21T16:05:00Z',
    updatedAt: '2026-02-24T18:20:00Z',
    customerNotes: 'Bulk resort shipment for Goa heritage boutique villa.',
    internalSellerNotes: 'Commercial GST invoice attached. Palletized and shrink-wrapped.',
    timeline: [
      { id: 'log-30', timestamp: '2026-02-21 16:05', status: 'Confirmed', description: 'Commercial invoice generated', actor: 'System' },
      { id: 'log-31', timestamp: '2026-02-24 18:20', status: 'Shipped', description: 'Dispatched on long-haul freight truck #KA-04-E-8821', actor: 'Dispatch Officer' }
    ]
  },
  {
    id: 'ord-105',
    orderNumber: 'HT-ORD-2026-8928',
    clientId: 'client-3',
    clientName: 'Dr. Meera Nambiar',
    clientEmail: 'meera.nambiar.md@gmail.com',
    clientPhone: '+91 97402 88120',
    shippingAddress: {
      street: '88 Palm Meadows Boulevard, Koramangala 3rd Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560034',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Oslo 3-Seater Fluted Velvet Sofa',
        sku: 'HT-LIV-SOF-001',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        category: 'Living Room',
        price: 1299,
        quantity: 1
      },
      {
        productId: 'prod-8',
        productName: 'Solstice Grand Arched Solid Brass Floor Mirror',
        sku: 'HT-DEC-MRR-008',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
        category: 'Decor & Accents',
        price: 480,
        quantity: 1
      }
    ],
    subtotal: 1779,
    shippingFee: 0,
    tax: 160.11,
    discount: 50,
    totalAmount: 1889.11,
    status: 'Packed & Ready',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    trackingNumber: 'HT-EXP-BLR-6629',
    courierService: 'HomeTown Local Delivery',
    estimatedDelivery: '2026-02-27',
    placedAt: '2026-02-18T10:45:00Z',
    updatedAt: '2026-02-26T09:00:00Z',
    customerNotes: 'Please ring the bell twice. Evening delivery preferred after 6 PM.',
    timeline: [
      { id: 'log-40', timestamp: '2026-02-18 10:45', status: 'Confirmed', description: 'Order approved', actor: 'System' },
      { id: 'log-41', timestamp: '2026-02-26 09:00', status: 'Packed & Ready', description: 'Quality inspection passed. Mirror reinforced in wooden crate.', actor: 'QC Inspector' }
    ]
  },
  {
    id: 'ord-106',
    orderNumber: 'HT-ORD-2026-8948',
    clientId: 'client-4',
    clientName: 'Rohan & Tara Mehta',
    clientEmail: 'rohan.mehta@fintechventures.io',
    clientPhone: '+91 99205 17822',
    shippingAddress: {
      street: '18A Worli Sea Face Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400030',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-5',
        productName: 'Artisanal Travertine & Fluted Brass Coffee Table',
        sku: 'HT-DEC-COF-005',
        image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=80',
        category: 'Living Room',
        price: 890,
        quantity: 1
      },
      {
        productId: 'prod-4',
        productName: 'Verona Sculptural Bouclé Lounge Armchair',
        sku: 'HT-LIV-ARM-004',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
        category: 'Living Room',
        price: 649,
        quantity: 2
      },
      {
        productId: 'prod-12',
        productName: 'Artisan Terracotta & Ribbed Ceramic Vessel Collection (Set of 3)',
        sku: 'HT-DEC-VAS-012',
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
        category: 'Decor & Accents',
        price: 145,
        quantity: 1
      }
    ],
    subtotal: 2333,
    shippingFee: 0,
    tax: 209.97,
    discount: 75,
    totalAmount: 2467.97,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / QR',
    trackingNumber: 'HT-PENDING-ALLOCATION',
    courierService: 'HomeTown Premier Delivery',
    estimatedDelivery: '2026-03-02',
    placedAt: '2026-02-25T18:12:00Z',
    updatedAt: '2026-02-25T18:15:00Z',
    customerNotes: 'Please ensure packaging does not leave marks on freshly polished Italian marble flooring.',
    timeline: [
      { id: 'log-50', timestamp: '2026-02-25 18:12', status: 'Pending', description: 'Order created', actor: 'Client' },
      { id: 'log-51', timestamp: '2026-02-25 18:15', status: 'Confirmed', description: 'Payment of $2,467.97 verified instantly via UPI', actor: 'Gateway' }
    ]
  },
  {
    id: 'ord-107',
    orderNumber: 'HT-ORD-2026-8952',
    clientId: 'client-5',
    clientName: 'Kabir Varma',
    clientEmail: 'k.varma@varmaarchitects.org',
    clientPhone: '+91 98711 60044',
    shippingAddress: {
      street: 'Sector 29, Golf Course Extension Road',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-10',
        productName: 'Monaco Teak & Sunbrella 4-Piece Outdoor Lounge Set',
        sku: 'HT-OUT-SET-010',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        category: 'Outdoor',
        price: 2450,
        quantity: 1
      },
      {
        productId: 'prod-6',
        productName: 'Aura Spun Brass & Frosted Glass Pendant Chandelier',
        sku: 'HT-LGT-PEN-006',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
        category: 'Lighting',
        price: 320,
        quantity: 3
      }
    ],
    subtotal: 3410,
    shippingFee: 0,
    tax: 306.90,
    discount: 170,
    totalAmount: 3546.90,
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Net Banking',
    estimatedDelivery: '2026-03-08',
    placedAt: '2026-02-26T19:40:00Z',
    updatedAt: '2026-02-26T19:40:00Z',
    customerNotes: 'Designer trade discount applied. Awaiting corporate PO clearance.',
    timeline: [
      { id: 'log-60', timestamp: '2026-02-26 19:40', status: 'Pending', description: 'Order logged, awaiting NEFT transaction reference confirmation', actor: 'Client' }
    ]
  },
  {
    id: 'ord-108',
    orderNumber: 'HT-ORD-2026-8870',
    clientId: 'client-7',
    clientName: 'Siddharth Iyer',
    clientEmail: 'siddharth.iyer@iyercounsel.com',
    clientPhone: '+91 94440 12899',
    shippingAddress: {
      street: '42 Poes Garden, Alwarpet',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600086',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-7',
        productName: 'Geneva Executive Walnut Desk with Wireless Charging',
        sku: 'HT-STU-DSK-007',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
        category: 'Study & Office',
        price: 1150,
        quantity: 1
      }
    ],
    subtotal: 1150,
    shippingFee: 40,
    tax: 103.50,
    discount: 0,
    totalAmount: 1293.50,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    trackingNumber: 'HT-EXP-CHE-3319',
    courierService: 'BlueDart Heavy Apex',
    estimatedDelivery: '2026-02-16',
    placedAt: '2026-02-12T08:30:00Z',
    updatedAt: '2026-02-16T15:00:00Z',
    timeline: [
      { id: 'log-70', timestamp: '2026-02-12 08:30', status: 'Confirmed', description: 'Order placed', actor: 'Client' },
      { id: 'log-71', timestamp: '2026-02-16 15:00', status: 'Delivered', description: 'Delivered and assembled in law chamber', actor: 'Delivery Agent' }
    ]
  }
];

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    inquiryNumber: 'INQ-2026-441',
    clientId: 'client-1',
    clientName: 'Ananya Singhania',
    clientEmail: 'ananya.singhania@studiodesign.in',
    clientPhone: '+91 98201 44521',
    relatedOrderId: 'ord-101',
    relatedProductId: 'prod-1',
    relatedProductName: 'Oslo 3-Seater Fluted Velvet Sofa',
    category: 'Custom Dimensions & Fit',
    subject: 'Can we customize the Oslo sofa length to 240cm for Villa 14?',
    priority: 'High',
    status: 'In Progress',
    messages: [
      {
        id: 'msg-1',
        sender: 'Customer',
        senderName: 'Ananya Singhania',
        message: 'Hi HomeTown Team, For Order #HT-ORD-2026-8941, our client living room living area has extra clearance. Is it possible for your carpentry unit to lengthen the Oslo sofa from standard 220cm to 240cm while maintaining the fluted velvet proportions?',
        timestamp: '2026-02-25 11:30'
      },
      {
        id: 'msg-2',
        sender: 'Seller Support',
        senderName: 'Rajesh (Senior Furniture Specialist)',
        message: 'Hello Ananya! Yes, our custom carpentry unit can extend the internal kiln-dried pine frame to 240cm with an extra centre lumbar support strut. The customization fee is $180 and adds 4 extra business days to production. Shall we update the order specification sheet for you?',
        timestamp: '2026-02-25 14:15'
      }
    ],
    createdAt: '2026-02-25T11:30:00Z',
    updatedAt: '2026-02-25T14:15:00Z',
    assignedAgent: 'Rajesh Sharma (Lead Furniture Specialist)'
  },
  {
    id: 'inq-2',
    inquiryNumber: 'INQ-2026-439',
    clientId: 'client-2',
    clientName: 'Vikramaditya Oberoi',
    clientEmail: 'v.oberoi@oberoiholdings.com',
    clientPhone: '+91 98110 32900',
    relatedOrderId: 'ord-104',
    category: 'Delivery Schedule & Tracking',
    subject: 'Freight lift clearance specifications for Oberoi Goa project',
    priority: 'Urgent',
    status: 'New',
    messages: [
      {
        id: 'msg-3',
        sender: 'Customer',
        senderName: 'Vikramaditya Oberoi',
        message: 'Please send crate dimensions for the 3 Valhalla Sheesham Dining Tables. Our resort service elevator has a diagonal ceiling constraint of 245cm. We need to confirm if we need outdoor boom-crane hoisting.',
        timestamp: '2026-02-26 15:10'
      }
    ],
    createdAt: '2026-02-26T15:10:00Z',
    updatedAt: '2026-02-26T15:10:00Z',
    assignedAgent: 'Unassigned'
  },
  {
    id: 'inq-3',
    inquiryNumber: 'INQ-2026-435',
    clientId: 'client-4',
    clientName: 'Rohan & Tara Mehta',
    clientEmail: 'rohan.mehta@fintechventures.io',
    clientPhone: '+91 99205 17822',
    relatedProductId: 'prod-5',
    relatedProductName: 'Artisanal Travertine & Fluted Brass Coffee Table',
    category: 'Wood & Fabric Swatches',
    subject: 'Travertine sealing and stain protection care inquiry',
    priority: 'Medium',
    status: 'Resolved',
    messages: [
      {
        id: 'msg-4',
        sender: 'Customer',
        senderName: 'Tara Mehta',
        message: 'Hello! Does the travertine coffee table come pre-sealed against red wine or espresso spills? Do you recommend a specific natural stone sealant for weekly maintenance?',
        timestamp: '2026-02-22 09:00'
      },
      {
        id: 'msg-5',
        sender: 'Seller Support',
        senderName: 'Pooja (Customer Experience)',
        message: 'Hi Tara! All HomeTown Roman Travertine pieces receive two coats of food-grade oleophobic nano sealant at our workshop. We also provide a complimentary 100ml HomeTown Stone Revitalizer spray with the table box! Avoid acidic cleaners (like vinegar) and use a soft damp microfiber cloth.',
        timestamp: '2026-02-22 10:45'
      },
      {
        id: 'msg-6',
        sender: 'Customer',
        senderName: 'Tara Mehta',
        message: 'Thank you Pooja! That is wonderful to know. Placing the order right away.',
        timestamp: '2026-02-22 11:20'
      }
    ],
    createdAt: '2026-02-22T09:00:00Z',
    updatedAt: '2026-02-22T11:20:00Z',
    assignedAgent: 'Pooja V (Stone & Material Specialist)'
  },
  {
    id: 'inq-4',
    inquiryNumber: 'INQ-2026-428',
    clientId: 'client-5',
    clientName: 'Kabir Varma',
    clientEmail: 'k.varma@varmaarchitects.org',
    clientPhone: '+91 98711 60044',
    relatedProductId: 'prod-10',
    relatedProductName: 'Monaco Teak & Sunbrella 4-Piece Outdoor Lounge Set',
    category: 'Bulk Commercial Pricing',
    subject: 'Commercial trade catalog & CAD blocks for penthouse terrace project',
    priority: 'High',
    status: 'Awaiting Client',
    messages: [
      {
        id: 'msg-7',
        sender: 'Customer',
        senderName: 'Kabir Varma',
        message: 'Can you provide the Revit (.rfa) or 3D AutoCAD files for the Monaco Outdoor Set and Sora Teak chairs? We are drafting the terrace layout for a 5-unit luxury penthouse.',
        timestamp: '2026-02-20 16:30'
      },
      {
        id: 'msg-8',
        sender: 'Seller Support',
        senderName: 'Vikram (Trade Relations)',
        message: 'Hi Kabir, I have emailed the ZIP archive containing high-poly OBJ, 3DS Max, and Revit 2024 BIM files to your registered email k.varma@varmaarchitects.org. Let us know if you need physical Sunbrella swatch cards delivered to your Gurgaon studio.',
        timestamp: '2026-02-21 09:30'
      }
    ],
    createdAt: '2026-02-20T16:30:00Z',
    updatedAt: '2026-02-21T09:30:00Z',
    assignedAgent: 'Vikram Mehta (Trade Account Manager)'
  }
];

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'inv-log-1',
    productId: 'prod-1',
    productName: 'Oslo 3-Seater Fluted Velvet Sofa',
    sku: 'HT-LIV-SOF-001',
    type: 'SALE',
    previousStock: 16,
    newStock: 14,
    change: -2,
    warehouse: 'Central Warehouse - Hub A',
    reason: 'Fulfilled Order #HT-ORD-2026-8941 (Singhania Interiors)',
    timestamp: '2026-02-24 14:32:10',
    performedBy: 'Automated Sales Sync'
  },
  {
    id: 'inv-log-2',
    productId: 'prod-2',
    productName: 'Valhalla 8-Seater Solid Sheesham Dining Table',
    sku: 'HT-DIN-TBL-002',
    type: 'SALE',
    previousStock: 9,
    newStock: 6,
    change: -3,
    warehouse: 'North Hub - Sector 4',
    reason: 'Fulfilled Order #HT-ORD-2026-8935 (Oberoi Holdings)',
    timestamp: '2026-02-21 16:05:44',
    performedBy: 'Automated Sales Sync'
  },
  {
    id: 'inv-log-3',
    productId: 'prod-4',
    productName: 'Verona Sculptural Bouclé Lounge Armchair',
    sku: 'HT-LIV-ARM-004',
    type: 'RESTOCK',
    previousStock: 12,
    newStock: 22,
    change: 10,
    warehouse: 'West Depot - Unit 2',
    reason: 'Factory production batch inbound PO #FCT-901',
    timestamp: '2026-02-20 10:14:00',
    performedBy: 'Warehouse Supv. Anil'
  },
  {
    id: 'inv-log-4',
    productId: 'prod-7',
    productName: 'Geneva Executive Walnut Desk with Wireless Charging',
    sku: 'HT-STU-DSK-007',
    type: 'SALE',
    previousStock: 1,
    newStock: 0,
    change: -1,
    warehouse: 'North Hub - Sector 4',
    reason: 'Sold out via Order #HT-ORD-2026-8870 (Siddharth Iyer)',
    timestamp: '2026-02-12 08:30:19',
    performedBy: 'Automated Sales Sync'
  },
  {
    id: 'inv-log-5',
    productId: 'prod-6',
    productName: 'Aura Spun Brass & Frosted Glass Pendant Chandelier',
    sku: 'HT-LGT-PEN-006',
    type: 'MANUAL_ADJUSTMENT',
    previousStock: 36,
    newStock: 35,
    change: -1,
    warehouse: 'South Depot - Bay 1',
    reason: 'Quality inspection display sample allocation',
    timestamp: '2026-02-18 17:00:22',
    performedBy: 'Lead QC Specialist'
  }
];
