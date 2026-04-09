export type FieldType = "text" | "textarea" | "date" | "email" | "phone" | "number" | "select" | "checkbox" | "signature" | "heading" | "paragraph";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  width?: "full" | "half";
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: "rental" | "property-management" | "legal";
  icon: string;
  fields: FormField[];
}

export const FORM_CATEGORIES = [
  { id: "rental", label: "Rental / Lease", icon: "Home", color: "text-blue-400", bg: "from-blue-500/15 to-blue-500/5" },
  { id: "property-management", label: "Property Management", icon: "Building2", color: "text-amber-400", bg: "from-amber-500/15 to-amber-500/5" },
  { id: "legal", label: "General Legal", icon: "Scale", color: "text-purple-400", bg: "from-purple-500/15 to-purple-500/5" },
] as const;

export const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Text Input", icon: "Type" },
  { type: "textarea", label: "Text Area", icon: "AlignLeft" },
  { type: "date", label: "Date", icon: "Calendar" },
  { type: "email", label: "Email", icon: "Mail" },
  { type: "phone", label: "Phone", icon: "Phone" },
  { type: "number", label: "Number", icon: "Hash" },
  { type: "select", label: "Dropdown", icon: "ChevronDown" },
  { type: "checkbox", label: "Checkbox", icon: "CheckSquare" },
  { type: "signature", label: "Signature", icon: "PenTool" },
  { type: "heading", label: "Heading", icon: "Heading" },
  { type: "paragraph", label: "Paragraph", icon: "FileText" },
];

let _fieldCounter = 0;
export const makeFieldId = () => `field_${++_fieldCounter}_${Date.now()}`;

export const FORM_TEMPLATES: FormTemplate[] = [
  // ── California Residential Lease Agreement (CAR-style) ──
  {
    id: "ca-residential-lease",
    name: "California Residential Lease Agreement",
    description: "Standard California residential lease agreement compliant with CA Civil Code §1940–1954.06. Covers all legally required disclosures and terms.",
    category: "rental",
    icon: "Home",
    fields: [
      { id: "h_title", type: "heading", label: "CALIFORNIA RESIDENTIAL LEASE AGREEMENT" },
      { id: "p_intro", type: "paragraph", label: "This Residential Lease Agreement (\"Agreement\") is entered into pursuant to California Civil Code §1940 et seq. and constitutes a legally binding contract between the Landlord and Tenant(s) identified below for the rental of the Premises described herein." },

      { id: "h_parties", type: "heading", label: "1. PARTIES" },
      { id: "landlord_name", type: "text", label: "Landlord / Property Manager (Full Legal Name)", required: true },
      { id: "landlord_address", type: "textarea", label: "Landlord Mailing Address", required: true, placeholder: "Street, City, State ZIP" },
      { id: "landlord_phone", type: "phone", label: "Landlord Phone", required: true, width: "half" },
      { id: "landlord_email", type: "email", label: "Landlord Email", required: true, width: "half" },
      { id: "tenant_1_name", type: "text", label: "Tenant 1 (Full Legal Name)", required: true },
      { id: "tenant_1_phone", type: "phone", label: "Tenant 1 Phone", width: "half" },
      { id: "tenant_1_email", type: "email", label: "Tenant 1 Email", width: "half" },
      { id: "tenant_2_name", type: "text", label: "Tenant 2 (Full Legal Name)" },
      { id: "tenant_2_phone", type: "phone", label: "Tenant 2 Phone", width: "half" },
      { id: "tenant_2_email", type: "email", label: "Tenant 2 Email", width: "half" },

      { id: "h_premises", type: "heading", label: "2. PREMISES" },
      { id: "property_address", type: "textarea", label: "Property Address (Street, Unit, City, County, State, ZIP)", required: true },
      { id: "property_type", type: "select", label: "Property Type", options: ["Single Family Home", "Apartment", "Condominium", "Townhouse", "Duplex/Triplex", "Room in Shared Dwelling", "Mobile Home"], required: true },
      { id: "bedrooms", type: "number", label: "Number of Bedrooms", required: true, width: "half" },
      { id: "bathrooms", type: "number", label: "Number of Bathrooms", required: true, width: "half" },
      { id: "parking", type: "select", label: "Parking", options: ["Included — Garage", "Included — Carport", "Included — Assigned Space", "Street Parking Only", "None"], width: "half" },
      { id: "storage", type: "select", label: "Storage", options: ["Included", "Available for additional fee", "None"], width: "half" },
      { id: "furnished", type: "select", label: "Furnishings", options: ["Unfurnished", "Partially Furnished", "Fully Furnished"] },

      { id: "h_term", type: "heading", label: "3. TERM OF TENANCY" },
      { id: "lease_type", type: "select", label: "Lease Type", options: ["Fixed-Term Lease", "Month-to-Month"], required: true },
      { id: "lease_start", type: "date", label: "Commencement Date", required: true, width: "half" },
      { id: "lease_end", type: "date", label: "Expiration Date (if fixed-term)", width: "half" },
      { id: "p_term", type: "paragraph", label: "If this is a fixed-term lease, upon expiration, this Agreement shall automatically convert to a month-to-month tenancy under the same terms, unless either party provides written notice of termination at least 30 days prior to the expiration date (60 days if Tenant has resided for one year or more, per CA Civil Code §1946.1)." },

      { id: "h_rent", type: "heading", label: "4. RENT" },
      { id: "rent_amount", type: "number", label: "Monthly Rent Amount ($)", required: true, width: "half" },
      { id: "rent_due_day", type: "select", label: "Rent Due Date", options: ["1st of each month", "5th of each month", "15th of each month"], required: true, width: "half" },
      { id: "rent_payment_method", type: "select", label: "Accepted Payment Methods", options: ["Check or Money Order", "Electronic Transfer / ACH", "Online Portal", "Check, ACH, or Online Portal"], required: true },
      { id: "rent_payable_to", type: "text", label: "Rent Payable To", required: true, placeholder: "Name or entity to make payments to" },
      { id: "rent_delivery", type: "textarea", label: "Payment Delivery Address / Instructions", placeholder: "Where and how to deliver rent payments" },

      { id: "h_late", type: "heading", label: "5. LATE CHARGES & RETURNED CHECKS" },
      { id: "grace_period", type: "select", label: "Grace Period", options: ["None", "3 days", "5 days", "7 days"], required: true, width: "half" },
      { id: "late_fee", type: "number", label: "Late Fee Amount ($)", required: true, width: "half" },
      { id: "p_late", type: "paragraph", label: "Pursuant to CA Civil Code §1671, late charges are deemed a reasonable estimate of the costs incurred by Landlord due to late payment. A fee of $25.00 will be charged for each returned/dishonored check (CA Civil Code §1719)." },

      { id: "h_security", type: "heading", label: "6. SECURITY DEPOSIT" },
      { id: "security_deposit", type: "number", label: "Security Deposit Amount ($)", required: true },
      { id: "p_security", type: "paragraph", label: "Pursuant to California Civil Code §1950.5, the total security deposit shall not exceed two months' rent for unfurnished units or three months' rent for furnished units. The security deposit will be held by Landlord and returned within 21 days after Tenant vacates the Premises, less any lawful deductions for: (a) unpaid rent; (b) cleaning costs to restore Premises to move-in condition; (c) repair of damages beyond normal wear and tear; (d) restoration of personal property. An itemized statement of deductions shall be provided." },

      { id: "h_utilities", type: "heading", label: "7. UTILITIES & SERVICES" },
      { id: "utilities_landlord", type: "textarea", label: "Utilities Paid by Landlord", placeholder: "e.g., Water, Trash, Sewer" },
      { id: "utilities_tenant", type: "textarea", label: "Utilities Paid by Tenant", placeholder: "e.g., Electricity, Gas, Internet, Cable" },

      { id: "h_occupancy", type: "heading", label: "8. OCCUPANCY & USE" },
      { id: "max_occupants", type: "number", label: "Maximum Number of Occupants", required: true },
      { id: "p_occupancy", type: "paragraph", label: "The Premises shall be used exclusively as a private residence for the Tenant(s) named above and their minor children. No part of the Premises shall be used for commercial purposes. Tenant shall not sublet, assign, or transfer this Agreement without prior written consent of Landlord. Guest stays exceeding 14 consecutive days or 30 cumulative days in any 12-month period require Landlord's prior written approval." },

      { id: "h_maintenance", type: "heading", label: "9. MAINTENANCE, REPAIRS & ALTERATIONS" },
      { id: "p_maint", type: "paragraph", label: "Landlord shall maintain the Premises in habitable condition as required by CA Civil Code §1941 and §1941.1, including maintaining effective waterproofing, plumbing, heating, electricity, sanitation, and structural integrity. Tenant shall keep the Premises clean and sanitary, use all systems and fixtures in their intended manner, and promptly notify Landlord in writing of any needed repairs. Tenant shall not make alterations, additions, or improvements without Landlord's prior written consent." },

      { id: "h_pets", type: "heading", label: "10. PETS" },
      { id: "pets_allowed", type: "select", label: "Pet Policy", options: ["No pets allowed", "Pets allowed with written approval", "Cats only (with approval)", "Dogs under 25 lbs only (with approval)"], required: true },
      { id: "pet_deposit", type: "number", label: "Additional Pet Deposit ($)", width: "half" },
      { id: "pet_rent", type: "number", label: "Monthly Pet Rent ($)", width: "half" },
      { id: "p_pets", type: "paragraph", label: "Service animals and emotional support animals are exempt from pet restrictions per California Fair Employment and Housing Act (FEHA) and federal Fair Housing Act (FHA). Tenant must provide proper documentation upon request." },

      { id: "h_disclosures", type: "heading", label: "11. REQUIRED CALIFORNIA DISCLOSURES" },
      { id: "p_disc_lead", type: "paragraph", label: "LEAD-BASED PAINT (Pre-1978 Properties): If the Premises were built before 1978, Landlord has provided the EPA pamphlet \"Protect Your Family From Lead in Your Home\" and disclosed known lead-based paint or hazards, or lack of knowledge thereof, per federal law (42 U.S.C. §4852d)." },
      { id: "built_before_1978", type: "select", label: "Was property built before 1978?", options: ["Yes", "No", "Unknown"], required: true },
      { id: "p_disc_mold", type: "paragraph", label: "MOLD: Pursuant to CA Health & Safety Code §26147-26148, Landlord has disclosed any known mold or environmental hazards on the Premises." },
      { id: "mold_known", type: "select", label: "Known mold present?", options: ["No known mold", "Yes — see attached disclosure"], width: "half" },
      { id: "p_disc_flood", type: "paragraph", label: "FLOOD ZONE / NATURAL HAZARDS: Pursuant to CA Civil Code §1103, a Natural Hazard Disclosure Statement has been or will be provided if applicable." },
      { id: "p_disc_megan", type: "paragraph", label: "MEGAN'S LAW: Notice — Pursuant to CA Civil Code §2079.10a, information about specified registered sex offenders is available to the public via the Megan's Law website (www.meganslaw.ca.gov)." },
      { id: "p_disc_pest", type: "paragraph", label: "PEST CONTROL: Pursuant to CA Civil Code §1099, Landlord shall disclose any known pest control company servicing the property and information about pesticide use." },
      { id: "p_disc_demo", type: "paragraph", label: "DEMOLITION: If applicable, Landlord has disclosed any intent to demolish the unit within the next year (CA Civil Code §1940.6)." },
      { id: "p_disc_smoke", type: "paragraph", label: "SMOKE/CO DETECTORS: Pursuant to CA Health & Safety Code §13113.8 and §17926, the Premises are equipped with functioning smoke detectors and carbon monoxide detectors." },
      { id: "smoke_co_confirmed", type: "checkbox", label: "Landlord confirms all smoke and CO detectors are installed and operational." },

      { id: "h_entry", type: "heading", label: "12. RIGHT OF ENTRY" },
      { id: "p_entry", type: "paragraph", label: "Pursuant to CA Civil Code §1954, Landlord may enter the Premises with at least 24 hours' prior written notice for: (a) necessary or agreed-upon repairs; (b) to show the Premises to prospective tenants, buyers, or lenders; (c) under court order; (d) when Tenant has abandoned the Premises. Entry shall be during normal business hours unless Tenant consents otherwise. In cases of emergency, Landlord may enter without notice." },

      { id: "h_termination", type: "heading", label: "13. TERMINATION & RENEWAL" },
      { id: "p_term_notice", type: "paragraph", label: "Either party may terminate a month-to-month tenancy by providing written notice as required: 30 days (tenancy under 1 year) or 60 days (tenancy of 1 year or more) per CA Civil Code §1946.1. For fixed-term leases, this Agreement terminates on the Expiration Date unless renewed in writing. Landlord may terminate for just cause as defined under the California Tenant Protection Act (AB 1482) where applicable." },

      { id: "h_ab1482", type: "heading", label: "14. CALIFORNIA TENANT PROTECTION ACT (AB 1482)" },
      { id: "ab1482_exempt", type: "select", label: "Is this property exempt from AB 1482?", options: ["Not exempt — AB 1482 applies", "Exempt — Single family home (owner not REIT/corp)", "Exempt — Built within last 15 years", "Exempt — Owner-occupied duplex"], required: true },
      { id: "p_ab1482", type: "paragraph", label: "If subject to AB 1482 (CA Civil Code §1946.2 and §1947.12): (a) Rent increases are capped at 5% + local CPI or 10%, whichever is lower, per 12-month period. (b) Termination by Landlord requires just cause after Tenant has occupied the unit for 12 months. (c) If Landlord terminates for no-fault just cause, relocation assistance equal to one month's rent must be provided." },

      { id: "h_additional", type: "heading", label: "15. ADDITIONAL TERMS & CONDITIONS" },
      { id: "additional_terms", type: "textarea", label: "Additional Terms", placeholder: "Enter any additional terms, house rules, or special conditions..." },

      { id: "h_governing", type: "heading", label: "16. GOVERNING LAW & DISPUTE RESOLUTION" },
      { id: "p_governing", type: "paragraph", label: "This Agreement shall be governed by and construed in accordance with the laws of the State of California. Any disputes arising under this Agreement shall first be submitted to mediation. If mediation fails, disputes shall be resolved through binding arbitration or in the appropriate California court of jurisdiction. The prevailing party in any action shall be entitled to reasonable attorney's fees and costs." },

      { id: "h_entirety", type: "heading", label: "17. ENTIRE AGREEMENT" },
      { id: "p_entirety", type: "paragraph", label: "This Agreement, including any addenda and attachments, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements. No modification shall be binding unless in writing and signed by all parties. If any provision is held to be unenforceable, the remaining provisions shall remain in full force and effect." },

      { id: "h_signatures", type: "heading", label: "SIGNATURES" },
      { id: "p_sig_notice", type: "paragraph", label: "By signing below, the parties acknowledge that they have read, understand, and agree to all terms and conditions of this Agreement. Each party has received a copy of this Agreement. Electronic signatures are valid and enforceable under the California Uniform Electronic Transactions Act (CA Civil Code §1633.1 et seq.) and the federal ESIGN Act (15 U.S.C. §7001 et seq.)." },
      { id: "landlord_sig", type: "signature", label: "Landlord / Authorized Agent Signature", required: true },
      { id: "landlord_sig_date", type: "date", label: "Date", required: true, width: "half" },
      { id: "landlord_print_name", type: "text", label: "Print Name", required: true, width: "half" },
      { id: "tenant_1_sig", type: "signature", label: "Tenant 1 Signature", required: true },
      { id: "tenant_1_sig_date", type: "date", label: "Date", required: true, width: "half" },
      { id: "tenant_1_print_name", type: "text", label: "Print Name", required: true, width: "half" },
      { id: "tenant_2_sig", type: "signature", label: "Tenant 2 Signature" },
      { id: "tenant_2_sig_date", type: "date", label: "Date", width: "half" },
      { id: "tenant_2_print_name", type: "text", label: "Print Name", width: "half" },
    ],
  },
  // ── CA Month-to-Month Rental Agreement ──
  {
    id: "ca-month-to-month",
    name: "California Month-to-Month Rental Agreement",
    description: "Month-to-month tenancy agreement compliant with CA Civil Code. Auto-renews monthly with 30/60-day termination notice.",
    category: "rental",
    icon: "Home",
    fields: [
      { id: "h1", type: "heading", label: "CALIFORNIA MONTH-TO-MONTH RENTAL AGREEMENT" },
      { id: "p_intro", type: "paragraph", label: "This Month-to-Month Rental Agreement is entered into pursuant to California Civil Code §1940 et seq. This tenancy may be terminated by either party with 30 days' written notice (60 days if Tenant has resided for one year or more per CA Civil Code §1946.1)." },
      { id: "landlord_name", type: "text", label: "Landlord (Full Legal Name)", required: true },
      { id: "landlord_email", type: "email", label: "Landlord Email", required: true, width: "half" },
      { id: "landlord_phone", type: "phone", label: "Landlord Phone", width: "half" },
      { id: "tenant_name", type: "text", label: "Tenant (Full Legal Name)", required: true },
      { id: "tenant_email", type: "email", label: "Tenant Email", required: true, width: "half" },
      { id: "tenant_phone", type: "phone", label: "Tenant Phone", width: "half" },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "start_date", type: "date", label: "Commencement Date", required: true },
      { id: "rent_amount", type: "number", label: "Monthly Rent ($)", required: true, width: "half" },
      { id: "rent_due_day", type: "select", label: "Due Date", options: ["1st of each month", "5th of each month", "15th of each month"], width: "half" },
      { id: "security_deposit", type: "number", label: "Security Deposit ($)", required: true },
      { id: "late_fee", type: "number", label: "Late Fee ($)", width: "half" },
      { id: "grace_period", type: "select", label: "Grace Period", options: ["None", "3 days", "5 days"], width: "half" },
      { id: "utilities_included", type: "textarea", label: "Utilities Included", placeholder: "List utilities included in rent..." },
      { id: "pets", type: "select", label: "Pet Policy", options: ["No pets", "Pets with approval", "Cats only", "Dogs under 25 lbs"] },
      { id: "p_legal", type: "paragraph", label: "This Agreement incorporates all required California disclosures including lead-based paint (if pre-1978), Megan's Law notification (CA Civil Code §2079.10a), smoke/CO detector compliance (CA Health & Safety Code §13113.8), and security deposit limits (CA Civil Code §1950.5). The California Tenant Protection Act (AB 1482) applies unless property is exempt." },
      { id: "additional_terms", type: "textarea", label: "Additional Terms" },
      { id: "landlord_sig", type: "signature", label: "Landlord Signature", required: true },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
      { id: "sign_date", type: "date", label: "Date Signed", required: true },
    ],
  },
  // ── Rental Application ──
  {
    id: "rental-application",
    name: "Rental Application",
    description: "Comprehensive tenant screening application compliant with California fair housing laws.",
    category: "rental",
    icon: "ClipboardList",
    fields: [
      { id: "h1", type: "heading", label: "RENTAL APPLICATION" },
      { id: "p1", type: "paragraph", label: "This application is used to screen prospective tenants. All information will be verified. A non-refundable application fee may apply per CA Civil Code §1950.6 (not to exceed the actual cost of screening)." },
      { id: "applicant_name", type: "text", label: "Applicant Full Legal Name", required: true },
      { id: "dob", type: "date", label: "Date of Birth", required: true, width: "half" },
      { id: "ssn_last4", type: "text", label: "SSN (Last 4 Digits)", width: "half" },
      { id: "email", type: "email", label: "Email", required: true, width: "half" },
      { id: "phone", type: "phone", label: "Phone", required: true, width: "half" },
      { id: "drivers_license", type: "text", label: "Driver's License / ID Number", width: "half" },
      { id: "dl_state", type: "text", label: "Issuing State", width: "half" },
      { id: "h_res", type: "heading", label: "Current Residence" },
      { id: "current_address", type: "textarea", label: "Current Address", required: true },
      { id: "current_rent", type: "number", label: "Current Monthly Rent ($)", width: "half" },
      { id: "move_in_date_current", type: "date", label: "Move-In Date", width: "half" },
      { id: "current_landlord", type: "text", label: "Current Landlord / Manager Name" },
      { id: "current_landlord_phone", type: "phone", label: "Landlord Phone" },
      { id: "reason_leaving", type: "textarea", label: "Reason for Leaving" },
      { id: "h_emp", type: "heading", label: "Employment & Income" },
      { id: "employer", type: "text", label: "Current Employer", required: true },
      { id: "employer_address", type: "text", label: "Employer Address" },
      { id: "job_title", type: "text", label: "Position / Title", width: "half" },
      { id: "monthly_income", type: "number", label: "Gross Monthly Income ($)", required: true, width: "half" },
      { id: "employer_phone", type: "phone", label: "Employer Phone", width: "half" },
      { id: "years_employed", type: "number", label: "Years at Current Job", width: "half" },
      { id: "other_income", type: "number", label: "Other Monthly Income ($)", width: "half" },
      { id: "other_income_source", type: "text", label: "Source of Other Income", width: "half" },
      { id: "h_occ", type: "heading", label: "Occupants & Pets" },
      { id: "move_in_date", type: "date", label: "Desired Move-In Date", required: true },
      { id: "num_occupants", type: "number", label: "Total Number of Occupants", required: true, width: "half" },
      { id: "pets", type: "select", label: "Pets", options: ["None", "Cat", "Dog", "Other"], width: "half" },
      { id: "pet_details", type: "text", label: "Pet Details (breed, weight)" },
      { id: "h_history", type: "heading", label: "Background" },
      { id: "felony", type: "select", label: "Have you been convicted of a felony?", options: ["No", "Yes — details attached"], required: true },
      { id: "evicted", type: "select", label: "Have you ever been evicted?", options: ["No", "Yes — details attached"], required: true },
      { id: "bankruptcy", type: "select", label: "Have you filed for bankruptcy?", options: ["No", "Yes — details attached"], required: true },
      { id: "h_ref", type: "heading", label: "Personal References" },
      { id: "ref_1", type: "text", label: "Reference 1 (Name, Relation, Phone)" },
      { id: "ref_2", type: "text", label: "Reference 2 (Name, Relation, Phone)" },
      { id: "h_auth", type: "heading", label: "Authorization & Consent" },
      { id: "consent_bg", type: "checkbox", label: "I authorize the Landlord or their agent to obtain a consumer credit report, criminal background check, and verify employment, rental history, and references for the purpose of evaluating this application." },
      { id: "consent_true", type: "checkbox", label: "I certify that all information provided in this application is true and complete. Falsification of any information may result in denial or termination of tenancy." },
      { id: "applicant_sig", type: "signature", label: "Applicant Signature", required: true },
      { id: "app_date", type: "date", label: "Date", required: true },
    ],
  },
  // ── Move-In / Move-Out Checklist ──
  {
    id: "move-in-checklist",
    name: "Move-In / Move-Out Inspection",
    description: "Property condition inspection checklist for move-in and move-out per CA Civil Code §1950.5.",
    category: "rental",
    icon: "ClipboardCheck",
    fields: [
      { id: "h1", type: "heading", label: "MOVE-IN / MOVE-OUT INSPECTION CHECKLIST" },
      { id: "p1", type: "paragraph", label: "Pursuant to CA Civil Code §1950.5(f), Landlord shall notify Tenant of the right to an initial and final inspection. This checklist documents the condition of the Premises." },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "tenant_name", type: "text", label: "Tenant Name", required: true },
      { id: "inspection_type", type: "select", label: "Inspection Type", options: ["Move-In", "Move-Out", "Pre-Move-Out (Initial)"], required: true },
      { id: "inspection_date", type: "date", label: "Inspection Date", required: true },
      { id: "h_rooms", type: "heading", label: "Room-by-Room Condition" },
      { id: "living_room", type: "select", label: "Living Room", options: ["Excellent", "Good", "Fair", "Poor — see notes"] },
      { id: "living_room_notes", type: "textarea", label: "Living Room Notes (walls, flooring, windows, fixtures)" },
      { id: "kitchen", type: "select", label: "Kitchen", options: ["Excellent", "Good", "Fair", "Poor — see notes"] },
      { id: "kitchen_notes", type: "textarea", label: "Kitchen Notes (counters, cabinets, appliances, plumbing)" },
      { id: "bedroom_1", type: "select", label: "Bedroom 1", options: ["Excellent", "Good", "Fair", "Poor — see notes"] },
      { id: "bedroom_1_notes", type: "textarea", label: "Bedroom 1 Notes" },
      { id: "bedroom_2", type: "select", label: "Bedroom 2", options: ["Excellent", "Good", "Fair", "Poor — see notes", "N/A"] },
      { id: "bedroom_2_notes", type: "textarea", label: "Bedroom 2 Notes" },
      { id: "bathroom_1", type: "select", label: "Bathroom 1", options: ["Excellent", "Good", "Fair", "Poor — see notes"] },
      { id: "bathroom_1_notes", type: "textarea", label: "Bathroom 1 Notes (toilet, tub/shower, sink, mirror, tiles)" },
      { id: "bathroom_2", type: "select", label: "Bathroom 2", options: ["Excellent", "Good", "Fair", "Poor — see notes", "N/A"] },
      { id: "bathroom_2_notes", type: "textarea", label: "Bathroom 2 Notes" },
      { id: "exterior", type: "select", label: "Exterior / Yard", options: ["Excellent", "Good", "Fair", "Poor — see notes", "N/A"] },
      { id: "exterior_notes", type: "textarea", label: "Exterior Notes" },
      { id: "h_systems", type: "heading", label: "Systems & Safety" },
      { id: "smoke_detectors", type: "select", label: "Smoke Detectors", options: ["Working", "Not working", "Missing"] },
      { id: "co_detectors", type: "select", label: "CO Detectors", options: ["Working", "Not working", "Missing"] },
      { id: "keys_provided", type: "text", label: "Keys / Remotes Provided", placeholder: "e.g., 2 door keys, 1 mailbox key, 1 garage remote" },
      { id: "general_notes", type: "textarea", label: "General Notes / Pre-Existing Damages" },
      { id: "landlord_sig", type: "signature", label: "Landlord / Agent Signature", required: true },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
    ],
  },
  // ── 3-Day Notice to Pay or Quit ──
  {
    id: "ca-3day-notice",
    name: "3-Day Notice to Pay Rent or Quit",
    description: "California statutory notice required before filing unlawful detainer for nonpayment of rent (CA Code of Civil Procedure §1161).",
    category: "rental",
    icon: "ShieldAlert",
    fields: [
      { id: "h1", type: "heading", label: "THREE-DAY NOTICE TO PAY RENT OR QUIT" },
      { id: "p_law", type: "paragraph", label: "Pursuant to California Code of Civil Procedure §1161(2), you are hereby notified that the rent on the premises described below is past due. You are required to pay the total amount due within THREE (3) DAYS of service of this notice or vacate and surrender the premises. Failure to comply may result in legal proceedings to recover possession and past-due rent." },
      { id: "tenant_name", type: "text", label: "Tenant Name(s)", required: true },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "rent_period", type: "text", label: "Rent Period Due", required: true, placeholder: "e.g., April 1–30, 2026" },
      { id: "amount_due", type: "number", label: "Total Amount Due ($)", required: true },
      { id: "p_note", type: "paragraph", label: "IMPORTANT: This notice demands ONLY the amount of rent due. It does not include late fees, utilities, or other charges (per CA Civil Code §1161). Only past-due rent may be claimed in a 3-day notice." },
      { id: "payment_method", type: "textarea", label: "How to Pay (accepted methods and delivery location)", required: true },
      { id: "landlord_name", type: "text", label: "Landlord / Agent Name", required: true },
      { id: "landlord_phone", type: "phone", label: "Phone", width: "half" },
      { id: "service_date", type: "date", label: "Date of Service", required: true, width: "half" },
      { id: "service_method", type: "select", label: "Method of Service", options: ["Personal delivery", "Substituted service + mailing", "Posting and mailing"], required: true },
      { id: "landlord_sig", type: "signature", label: "Landlord / Agent Signature", required: true },
    ],
  },
  // ── Property Management Agreement ──
  {
    id: "management-agreement",
    name: "Property Management Agreement",
    description: "Professional management agreement between property owner and EC Rental Property Management LLC.",
    category: "property-management",
    icon: "Building2",
    fields: [
      { id: "h1", type: "heading", label: "PROPERTY MANAGEMENT AGREEMENT" },
      { id: "p1", type: "paragraph", label: "This Property Management Agreement (\"Agreement\") is entered into between the Property Owner and EC Rental Property Management LLC (\"Manager\") for the management of the property described herein, pursuant to California Business and Professions Code §10131 et seq." },
      { id: "owner_name", type: "text", label: "Property Owner (Full Legal Name)", required: true },
      { id: "owner_email", type: "email", label: "Owner Email", required: true, width: "half" },
      { id: "owner_phone", type: "phone", label: "Owner Phone", width: "half" },
      { id: "owner_address", type: "textarea", label: "Owner Mailing Address", required: true },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "property_type", type: "select", label: "Property Type", options: ["Single Family", "Multi-Family", "Condo", "Townhouse", "Commercial"], required: true },
      { id: "start_date", type: "date", label: "Agreement Start Date", required: true, width: "half" },
      { id: "end_date", type: "date", label: "Agreement End Date", required: true, width: "half" },
      { id: "mgmt_fee_percent", type: "number", label: "Monthly Management Fee (%)", required: true, width: "half" },
      { id: "leasing_fee", type: "number", label: "Tenant Placement Fee ($)", width: "half" },
      { id: "h_scope", type: "heading", label: "Scope of Services" },
      { id: "p_scope", type: "paragraph", label: "Manager shall provide the following services: (a) Marketing and advertising vacant units; (b) Screening prospective tenants; (c) Executing lease agreements; (d) Collecting rent and issuing receipts; (e) Coordinating maintenance and repairs; (f) Conducting periodic inspections; (g) Handling tenant communications; (h) Providing monthly financial statements; (i) Managing security deposits per CA Civil Code §1950.5." },
      { id: "emergency_fund", type: "number", label: "Maintenance Reserve Fund ($)", required: true },
      { id: "repair_limit", type: "number", label: "Per-Repair Authorization Limit ($)", required: true, placeholder: "Max amount without owner approval" },
      { id: "termination_notice", type: "select", label: "Termination Notice Period", options: ["30 days", "60 days", "90 days"], required: true },
      { id: "additional_terms", type: "textarea", label: "Additional Terms" },
      { id: "owner_sig", type: "signature", label: "Property Owner Signature", required: true },
      { id: "manager_sig", type: "signature", label: "Manager Signature", required: true },
      { id: "sign_date", type: "date", label: "Date Signed", required: true },
    ],
  },
  // ── Maintenance Request ──
  {
    id: "maintenance-request",
    name: "Maintenance Request Form",
    description: "Tenant maintenance/repair request form with urgency classification.",
    category: "property-management",
    icon: "Wrench",
    fields: [
      { id: "h1", type: "heading", label: "MAINTENANCE / REPAIR REQUEST" },
      { id: "tenant_name", type: "text", label: "Tenant Name", required: true },
      { id: "unit_number", type: "text", label: "Unit / Address", required: true },
      { id: "phone", type: "phone", label: "Phone", required: true, width: "half" },
      { id: "email", type: "email", label: "Email", width: "half" },
      { id: "request_date", type: "date", label: "Date of Request", required: true },
      { id: "category", type: "select", label: "Category", options: ["Plumbing", "Electrical", "HVAC / Heating", "Appliance", "Pest Control", "Structural / Roof", "Locks / Security", "Other"], required: true },
      { id: "urgency", type: "select", label: "Urgency Level", options: ["Emergency (immediate danger)", "Urgent (24-48 hours)", "Standard (3-5 business days)", "Low priority / cosmetic"], required: true },
      { id: "description", type: "textarea", label: "Describe the Issue in Detail", required: true },
      { id: "access", type: "select", label: "Permission to Enter Unit", options: ["Yes, anytime during business hours", "Yes, with 24-hour notice", "Contact me to schedule — must be present"], required: true },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
    ],
  },
  // ── 30-Day Notice to Vacate ──
  {
    id: "ca-30day-notice",
    name: "30-Day Notice to Vacate (Tenant)",
    description: "Tenant's written notice to terminate a month-to-month tenancy per CA Civil Code §1946.",
    category: "rental",
    icon: "FileSignature",
    fields: [
      { id: "h1", type: "heading", label: "30-DAY NOTICE OF INTENT TO VACATE" },
      { id: "p1", type: "paragraph", label: "Pursuant to California Civil Code §1946, this notice serves as the Tenant's written intent to terminate the month-to-month tenancy for the premises described below. The Tenant shall vacate and surrender possession of the Premises on or before the date specified." },
      { id: "tenant_name", type: "text", label: "Tenant Name(s)", required: true },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "notice_date", type: "date", label: "Date of This Notice", required: true, width: "half" },
      { id: "vacate_date", type: "date", label: "Intended Move-Out Date", required: true, width: "half" },
      { id: "forwarding_address", type: "textarea", label: "Forwarding Address (for security deposit return)", required: true },
      { id: "reason", type: "textarea", label: "Reason for Vacating (optional)" },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
      { id: "sign_date", type: "date", label: "Date", required: true },
    ],
  },
];
