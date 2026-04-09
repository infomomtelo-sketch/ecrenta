// Stripe product/price IDs for ecrenta service tiers
export const SERVICE_TIERS = {
  placement: {
    product_id: "prod_UIjPNkYpcpUtpp",
    price_id: "price_1TK7x5PO1GxEBHffr3tXpeq8",
    name: "Tenant Placement",
    price: 499,
    mode: "payment" as const,
    description: "One-time fee",
  },
  management: {
    product_id: "prod_UIjRKivuxq2P6Q",
    price_id: "price_1TK7ybPO1GxEBHff8fbANC6N",
    name: "Property Management",
    price: 99,
    mode: "subscription" as const,
    interval: "month" as const,
    description: "/mo per property",
  },
  premium: {
    product_id: "prod_UIjjuphOdICD0n",
    price_id: "price_1TK8FzPO1GxEBHffnms5uPk2",
    name: "Premium Guarantee",
    price: 149,
    mode: "subscription" as const,
    interval: "month" as const,
    description: "/mo per property",
  },
} as const;

// Legacy tiers kept for backward compat with existing subscribers
export const SUBSCRIPTION_TIERS = {
  monthly: {
    product_id: "prod_UH59QWiqzx0bB2",
    price_id: "price_1TIWzXPO1GxEBHffJzLR6vPL",
    name: "Landlord Monthly",
    price: 9.99,
    interval: "month" as const,
  },
  annual: {
    product_id: "prod_UH5AwKhzJIKtMl",
    price_id: "price_1TIX0PPO1GxEBHffrIxJ1SfX",
    name: "Landlord Annual",
    price: 99,
    interval: "year" as const,
  },
} as const;

export type SubscriptionTier = keyof typeof SERVICE_TIERS | keyof typeof SUBSCRIPTION_TIERS | null;

export function getTierByProductId(productId: string): SubscriptionTier {
  // Check new service tiers first
  for (const [key, tier] of Object.entries(SERVICE_TIERS)) {
    if (tier.product_id === productId) return key as SubscriptionTier;
  }
  // Legacy tiers
  if (productId === SUBSCRIPTION_TIERS.monthly.product_id) return "monthly";
  if (productId === SUBSCRIPTION_TIERS.annual.product_id) return "annual";
  return null;
}
