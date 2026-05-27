// Stripe product/price IDs for ecrenta service tiers
export const SERVICE_TIERS = {
  saas: {
    product_id: "prod_Uai1kF1YE9ncgn",
    price_id: "price_1TbWbhAH9qPFLg89XobRcfVH",
    name: "Self-Manage",
    price: 29,
    mode: "subscription" as const,
    interval: "month" as const,
    description: "/mo flat — unlimited properties",
  },
  management: {
    product_id: "prod_UNxB4vjoYawGoz",
    price_id: "price_1TPBGtAH9qPFLg89ej76BgQR",
    name: "Property Management",
    price: 99,
    mode: "subscription" as const,
    interval: "month" as const,
    description: "/mo per property",
  },
  premium: {
    product_id: "prod_UNxCsmk1he7wej",
    price_id: "price_1TPBI1AH9qPFLg89kgR4h7CJ",
    name: "Premium Service",
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
