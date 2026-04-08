// Stripe product/price IDs for ecrenta landlord subscriptions
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

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS | null;

export function getTierByProductId(productId: string): SubscriptionTier {
  if (productId === SUBSCRIPTION_TIERS.monthly.product_id) return "monthly";
  if (productId === SUBSCRIPTION_TIERS.annual.product_id) return "annual";
  return null;
}
