export interface Market {
  slug: string;
  name: string;
  county: string;
  state: string;
  active: boolean;
  hospitals?: string[];
  description?: string;
}

export const MARKETS: Market[] = [
  // Fresno County (launch market)
  { slug: "fresno", name: "Fresno", county: "Fresno", state: "CA", active: true,
    hospitals: ["Community Regional Medical Center", "Fresno VA Medical Center", "Kaiser Permanente Fresno"],
    description: "The heart of Central Valley with major hospitals and a growing healthcare workforce." },
  { slug: "clovis", name: "Clovis", county: "Fresno", state: "CA", active: true,
    hospitals: ["Clovis Community Medical Center"],
    description: "Family-friendly city adjacent to Fresno with top-rated schools and safe neighborhoods." },
  { slug: "madera", name: "Madera", county: "Madera", state: "CA", active: true,
    hospitals: ["Madera Community Hospital"],
    description: "Affordable living north of Fresno, gateway to Yosemite." },
  { slug: "sanger", name: "Sanger", county: "Fresno", state: "CA", active: true,
    description: "Small-town charm east of Fresno with easy highway access." },
  { slug: "selma", name: "Selma", county: "Fresno", state: "CA", active: true,
    description: "The Raisin Capital of the World, centrally located in the Valley." },
  { slug: "reedley", name: "Reedley", county: "Fresno", state: "CA", active: true,
    description: "Quiet Kings River community with affordable housing options." },

  // Central Valley expansion (coming soon)
  { slug: "visalia", name: "Visalia", county: "Tulare", state: "CA", active: false,
    hospitals: ["Kaweah Health"],
    description: "Tulare County's largest city with a major regional hospital." },
  { slug: "bakersfield", name: "Bakersfield", county: "Kern", state: "CA", active: false,
    hospitals: ["Kern Medical", "Mercy Hospital Bakersfield"],
    description: "Southern Central Valley hub with multiple healthcare systems." },
  { slug: "stockton", name: "Stockton", county: "San Joaquin", state: "CA", active: false,
    hospitals: ["St. Joseph's Medical Center", "Dameron Hospital"],
    description: "Northern Central Valley port city with growing healthcare demand." },
  { slug: "modesto", name: "Modesto", county: "Stanislaus", state: "CA", active: false,
    hospitals: ["Memorial Medical Center", "Doctors Medical Center"],
    description: "Stanislaus County seat with strong hospital presence." },
  { slug: "merced", name: "Merced", county: "Merced", state: "CA", active: false,
    hospitals: ["Mercy Medical Center Merced"],
    description: "Home to UC Merced, growing college town." },
  { slug: "hanford", name: "Hanford", county: "Kings", state: "CA", active: false,
    hospitals: ["Adventist Health Hanford"],
    description: "Kings County seat with affordable Central Valley living." },
];

export const getActiveMarkets = () => MARKETS.filter(m => m.active);
export const getComingSoonMarkets = () => MARKETS.filter(m => !m.active);
export const getMarketBySlug = (slug: string) => MARKETS.find(m => m.slug === slug);
export const getMarketAreas = () => [
  { label: "All Areas", value: "" },
  ...getActiveMarkets().map(m => ({ label: m.name, value: m.slug })),
];
