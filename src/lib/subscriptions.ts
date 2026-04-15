// Stripe product/price IDs for ecrenta service tiers
export const SERVICE_TIERS = {
  management: {
    product_id: "prod_UKzSp7VAscEPQb",
    price_id: "price_1TMJTyDC1mrZ8mSw8aBtXS89",
    name: "Property Management",
    price: 99,
    mode: "subscription" as const,
    interval: "month" as const,
    description: "/mo per property",
  },
  premium: {
    product_id: "prod_UKzTmt5ji9GI99",
    price_id: "price_1TMJUIDC1mrZ8mSwChcszg7U",
    name: "Premium Guarantee",
    price: 149,
    mode: "subscription" as const,
    interval: "month" as const,
    description: "/mo per property",
  },
} as const;

export type SubscriptionTier = keyof typeof SERVICE_TIERS | null;

export function getTierByProductId(productId: string): SubscriptionTier {
  for (const [key, tier] of Object.entries(SERVICE_TIERS)) {
    if (tier.product_id === productId) return key as SubscriptionTier;
  }
  return null;
}
