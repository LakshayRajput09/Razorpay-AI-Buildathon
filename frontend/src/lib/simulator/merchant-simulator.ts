/**
 * Deterministic Synthetic Merchant Simulator
 * Grounded in benchmark characteristics from UCI Online Retail II & IEEE-CIS Fraud Detection
 * Styled with Indian digital payment mechanics (UPI, RuPay/Visa/Mastercard, Netbanking, COD)
 */

export interface SimulatedCustomer {
  externalId: string;
  name: string;
  email: string;
  phone: string;
  segment: "CHAMPIONS" | "LOYAL" | "AT_RISK" | "HIBERNATING" | "NEW" | "HIGH_VALUE";
  location: string;
  accountAgeDays: number;
  totalSpend: number;
  orderCount: number;
  avgOrderValue: number;
  riskTier: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rfmScore: string;
  churnRisk: number;
}

export const CITIES = [
  "Bengaluru, Karnataka",
  "Mumbai, Maharashtra",
  "Delhi NCR",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Jaipur, Rajasthan",
  "Ahmedabad, Gujarat",
];

export const PRODUCTS = [
  { id: "PROD-SKU-101", name: "Merino Wool Knit Overshirt", category: "Apparel", price: 3499, returnRisk: 0.12 },
  { id: "PROD-SKU-102", name: "Italian Pebble Grain Oxford Shoes", category: "Footwear", price: 6999, returnRisk: 0.38 }, // higher size return risk
  { id: "PROD-SKU-103", name: "Heavyweight Boxy Tee - Jet Black", category: "Apparel", price: 1799, returnRisk: 0.08 },
  { id: "PROD-SKU-104", name: "Japanese Selvedge Denim Jeans", category: "Apparel", price: 5499, returnRisk: 0.22 },
  { id: "PROD-SKU-105", name: "Waterproof Techpack Messenger Bag", category: "Accessories", price: 4299, returnRisk: 0.06 },
  { id: "PROD-SKU-106", name: "Leather Minimalist Cardholder", category: "Accessories", price: 1299, returnRisk: 0.04 },
  { id: "PROD-SKU-107", name: "Heritage Chronograph Watch", category: "Luxury", price: 14999, returnRisk: 0.45 }, // high ticket, chargeback target
];

export function generateSeededCustomers(): SimulatedCustomer[] {
  return [
    {
      externalId: "CUST-IN-8801",
      name: "Aarav Sharma",
      email: "aarav.sharma@techscale.io",
      phone: "+91 98450 12345",
      segment: "CHAMPIONS",
      location: "Bengaluru, Karnataka",
      accountAgeDays: 480,
      totalSpend: 142500,
      orderCount: 18,
      avgOrderValue: 7916,
      riskTier: "LOW",
      rfmScore: "555",
      churnRisk: 0.04,
    },
    {
      externalId: "CUST-IN-8802",
      name: "Priya Nair",
      email: "priya.nair@corp.co.in",
      phone: "+91 98200 54321",
      segment: "LOYAL",
      location: "Mumbai, Maharashtra",
      accountAgeDays: 320,
      totalSpend: 68400,
      orderCount: 12,
      avgOrderValue: 5700,
      riskTier: "LOW",
      rfmScore: "444",
      churnRisk: 0.12,
    },
    {
      externalId: "CUST-IN-8803",
      name: "Rohan Varma",
      email: "rohan.v92@gmail.com",
      phone: "+91 98111 98765",
      segment: "AT_RISK",
      location: "Delhi NCR",
      accountAgeDays: 240,
      totalSpend: 34900,
      orderCount: 6,
      avgOrderValue: 5816,
      riskTier: "LOW",
      rfmScore: "243",
      churnRisk: 0.68,
    },
    {
      externalId: "CUST-IN-8804",
      name: "Vikram Malhotra",
      email: "vikram.m@vortexmail.xyz",
      phone: "+91 97000 11223",
      segment: "HIGH_VALUE",
      location: "Hyderabad, Telangana",
      accountAgeDays: 90,
      totalSpend: 89000,
      orderCount: 4,
      avgOrderValue: 22250,
      riskTier: "CRITICAL", // Fraud suspect: rapid high-ticket transactions
      rfmScore: "515",
      churnRisk: 0.40,
    },
    {
      externalId: "CUST-IN-8805",
      name: "Ananya Deshmukh",
      email: "ananya.d@designhaus.in",
      phone: "+91 99300 44556",
      segment: "CHAMPIONS",
      location: "Pune, Maharashtra",
      accountAgeDays: 520,
      totalSpend: 118000,
      orderCount: 15,
      avgOrderValue: 7866,
      riskTier: "LOW",
      rfmScore: "545",
      churnRisk: 0.05,
    },
    {
      externalId: "CUST-IN-8806",
      name: "Karan Singhal",
      email: "karan.s@singhaltraders.com",
      phone: "+91 98765 43210",
      segment: "HIBERNATING",
      location: "Jaipur, Rajasthan",
      accountAgeDays: 610,
      totalSpend: 24500,
      orderCount: 5,
      avgOrderValue: 4900,
      riskTier: "MEDIUM",
      rfmScore: "132",
      churnRisk: 0.82,
    },
    {
      externalId: "CUST-IN-8807",
      name: "Sneha Reddy",
      email: "sneha.reddy@infotech.org",
      phone: "+91 94400 88776",
      segment: "LOYAL",
      location: "Hyderabad, Telangana",
      accountAgeDays: 180,
      totalSpend: 47200,
      orderCount: 8,
      avgOrderValue: 5900,
      riskTier: "LOW",
      rfmScore: "434",
      churnRisk: 0.18,
    },
    {
      externalId: "CUST-IN-8808",
      name: "Devendra Iyer",
      email: "d.iyer@chennaiconsulting.com",
      phone: "+91 98400 99887",
      segment: "NEW",
      location: "Chennai, Tamil Nadu",
      accountAgeDays: 14,
      totalSpend: 14999,
      orderCount: 1,
      avgOrderValue: 14999,
      riskTier: "MEDIUM",
      rfmScore: "513",
      churnRisk: 0.35,
    },
    {
      externalId: "CUST-IN-8809",
      name: "Meera Patel",
      email: "meera.patel@gujaratcraft.in",
      phone: "+91 97200 33445",
      segment: "AT_RISK",
      location: "Ahmedabad, Gujarat",
      accountAgeDays: 310,
      totalSpend: 41500,
      orderCount: 7,
      avgOrderValue: 5928,
      riskTier: "LOW",
      rfmScore: "233",
      churnRisk: 0.62,
    },
    {
      externalId: "CUST-IN-8810",
      name: "Aditya Roy",
      email: "aditya.roy@freelance.studio",
      phone: "+91 98300 22334",
      segment: "HIGH_VALUE",
      location: "Kolkata, West Bengal",
      accountAgeDays: 200,
      totalSpend: 76000,
      orderCount: 9,
      avgOrderValue: 8444,
      riskTier: "LOW",
      rfmScore: "444",
      churnRisk: 0.22,
    },
  ];
}
