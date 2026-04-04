import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";

export interface Listing {
  id: string;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  images: string[];
  landlordName: string;
  listed: string;
  available: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: "text" | "image" | "status";
}

export interface Conversation {
  id: string;
  listingId: string;
  tenantName: string;
  tenantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  status: "inquiry" | "showing_scheduled" | "approved" | "declined";
  messages: Message[];
}

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 1850,
    address: "245 W 14th St, Apt 8B",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    description: "Bright and airy apartment in the heart of downtown. Features hardwood floors, large windows with city views, modern kitchen with stainless steel appliances, and in-unit laundry. Walking distance to transit, restaurants, and parks.",
    images: [listing1],
    landlordName: "Alex Chen",
    listed: "3 days ago",
    available: true,
  },
  {
    id: "2",
    title: "Cozy Brick Loft Studio",
    price: 1200,
    address: "78 Industrial Ave, Unit 3",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    description: "Charming exposed brick loft with character. Open layout with modern kitchen, warm lighting, and industrial-chic finishes. Perfect for a single professional or couple. Utilities included.",
    images: [listing2],
    landlordName: "Maria Santos",
    listed: "1 week ago",
    available: true,
  },
  {
    id: "3",
    title: "Spacious Suburban Family Home",
    price: 2800,
    address: "1422 Oak Ridge Dr",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    description: "Beautiful two-story home with a large front yard and covered porch. Newly renovated kitchen, hardwood floors throughout, attached 2-car garage. Quiet neighborhood near top-rated schools.",
    images: [listing3],
    landlordName: "James Wright",
    listed: "2 days ago",
    available: true,
  },
  {
    id: "4",
    title: "Luxury Penthouse with City Views",
    price: 5500,
    address: "One Tower Place, PH-2",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2100,
    description: "Stunning penthouse with panoramic city skyline views. Floor-to-ceiling windows, marble finishes, chef's kitchen, private terrace. Full-service building with concierge, gym, and rooftop pool.",
    images: [listing4],
    landlordName: "Victoria Reeves",
    listed: "Just listed",
    available: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    listingId: "1",
    tenantName: "Sarah Johnson",
    lastMessage: "Is the apartment still available?",
    lastMessageTime: "2 min ago",
    unread: 2,
    status: "inquiry",
    messages: [
      { id: "m1", senderId: "tenant", text: "Hi! I saw your listing for the Downtown Apartment. Is it still available?", timestamp: "10:30 AM", type: "text" },
      { id: "m2", senderId: "landlord", text: "Yes it is! Would you like to schedule a showing?", timestamp: "10:32 AM", type: "text" },
      { id: "m3", senderId: "tenant", text: "That would be great! Are evenings available?", timestamp: "10:35 AM", type: "text" },
    ],
  },
  {
    id: "conv-2",
    listingId: "3",
    tenantName: "David Park",
    lastMessage: "We loved the house! Ready to apply.",
    lastMessageTime: "1 hr ago",
    unread: 0,
    status: "showing_scheduled",
    messages: [
      { id: "m4", senderId: "tenant", text: "Hi, we're interested in the family home on Oak Ridge.", timestamp: "Yesterday", type: "text" },
      { id: "m5", senderId: "landlord", text: "Great! I have availability Saturday at 2pm. Does that work?", timestamp: "Yesterday", type: "text" },
      { id: "m6", senderId: "tenant", text: "Perfect, we'll be there!", timestamp: "Yesterday", type: "text" },
      { id: "m7", senderId: "tenant", text: "We loved the house! Ready to apply.", timestamp: "1 hr ago", type: "text" },
    ],
  },
];

export const statusLabels: Record<Conversation["status"], string> = {
  inquiry: "Inquiry",
  showing_scheduled: "Showing Scheduled",
  approved: "Approved",
  declined: "Declined",
};

export const statusColors: Record<Conversation["status"], string> = {
  inquiry: "bg-accent text-accent-foreground",
  showing_scheduled: "bg-primary text-primary-foreground",
  approved: "bg-primary text-primary-foreground",
  declined: "bg-destructive text-destructive-foreground",
};
