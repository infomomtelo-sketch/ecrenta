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
  // ── Rental / Lease ──
  {
    id: "residential-lease",
    name: "Residential Lease Agreement",
    description: "Standard lease agreement between landlord and tenant for a residential property.",
    category: "rental",
    icon: "Home",
    fields: [
      { id: "h1", type: "heading", label: "Residential Lease Agreement" },
      { id: "p1", type: "paragraph", label: "This Lease Agreement is entered into by and between the Landlord and Tenant identified below." },
      { id: "landlord_name", type: "text", label: "Landlord Full Name", required: true },
      { id: "landlord_email", type: "email", label: "Landlord Email", required: true, width: "half" },
      { id: "landlord_phone", type: "phone", label: "Landlord Phone", width: "half" },
      { id: "tenant_name", type: "text", label: "Tenant Full Name", required: true },
      { id: "tenant_email", type: "email", label: "Tenant Email", required: true, width: "half" },
      { id: "tenant_phone", type: "phone", label: "Tenant Phone", width: "half" },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "lease_start", type: "date", label: "Lease Start Date", required: true, width: "half" },
      { id: "lease_end", type: "date", label: "Lease End Date", required: true, width: "half" },
      { id: "rent_amount", type: "number", label: "Monthly Rent ($)", required: true, width: "half" },
      { id: "security_deposit", type: "number", label: "Security Deposit ($)", required: true, width: "half" },
      { id: "payment_due", type: "select", label: "Rent Due Day", options: ["1st", "5th", "10th", "15th"], width: "half" },
      { id: "late_fee", type: "number", label: "Late Fee ($)", width: "half" },
      { id: "utilities", type: "select", label: "Utilities Included", options: ["None", "Water only", "Water & Trash", "All utilities"] },
      { id: "pets_allowed", type: "select", label: "Pets Allowed", options: ["No pets", "Cats only", "Dogs only", "All pets with deposit"] },
      { id: "additional_terms", type: "textarea", label: "Additional Terms & Conditions" },
      { id: "landlord_sig", type: "signature", label: "Landlord Signature", required: true },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
      { id: "sign_date", type: "date", label: "Date Signed", required: true },
    ],
  },
  {
    id: "rental-application",
    name: "Rental Application",
    description: "Tenant application form for prospective renters to submit personal and financial information.",
    category: "rental",
    icon: "ClipboardList",
    fields: [
      { id: "h1", type: "heading", label: "Rental Application" },
      { id: "applicant_name", type: "text", label: "Applicant Full Name", required: true },
      { id: "dob", type: "date", label: "Date of Birth", required: true, width: "half" },
      { id: "ssn_last4", type: "text", label: "SSN (Last 4 digits)", width: "half" },
      { id: "email", type: "email", label: "Email", required: true, width: "half" },
      { id: "phone", type: "phone", label: "Phone", required: true, width: "half" },
      { id: "current_address", type: "textarea", label: "Current Address", required: true },
      { id: "current_landlord", type: "text", label: "Current Landlord Name" },
      { id: "current_landlord_phone", type: "phone", label: "Current Landlord Phone" },
      { id: "employer", type: "text", label: "Employer", required: true },
      { id: "job_title", type: "text", label: "Job Title", width: "half" },
      { id: "monthly_income", type: "number", label: "Monthly Income ($)", required: true, width: "half" },
      { id: "move_in_date", type: "date", label: "Desired Move-In Date", required: true },
      { id: "num_occupants", type: "number", label: "Number of Occupants", required: true, width: "half" },
      { id: "pets", type: "select", label: "Pets", options: ["None", "Cat", "Dog", "Other"], width: "half" },
      { id: "felony", type: "select", label: "Have you been convicted of a felony?", options: ["No", "Yes"], required: true },
      { id: "evicted", type: "select", label: "Have you ever been evicted?", options: ["No", "Yes"], required: true },
      { id: "references", type: "textarea", label: "Personal References (Name, Relation, Phone)" },
      { id: "consent", type: "checkbox", label: "I authorize the landlord to verify the information provided and conduct a background/credit check." },
      { id: "applicant_sig", type: "signature", label: "Applicant Signature", required: true },
      { id: "app_date", type: "date", label: "Date", required: true },
    ],
  },
  {
    id: "move-in-checklist",
    name: "Move-In / Move-Out Checklist",
    description: "Document the condition of a property at move-in and move-out for deposit reconciliation.",
    category: "rental",
    icon: "ClipboardCheck",
    fields: [
      { id: "h1", type: "heading", label: "Move-In / Move-Out Inspection Checklist" },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "tenant_name", type: "text", label: "Tenant Name", required: true },
      { id: "inspection_type", type: "select", label: "Inspection Type", options: ["Move-In", "Move-Out"], required: true },
      { id: "inspection_date", type: "date", label: "Inspection Date", required: true },
      { id: "living_room", type: "select", label: "Living Room Condition", options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: "living_room_notes", type: "textarea", label: "Living Room Notes" },
      { id: "kitchen", type: "select", label: "Kitchen Condition", options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: "kitchen_notes", type: "textarea", label: "Kitchen Notes" },
      { id: "bedroom", type: "select", label: "Bedroom(s) Condition", options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: "bedroom_notes", type: "textarea", label: "Bedroom Notes" },
      { id: "bathroom", type: "select", label: "Bathroom(s) Condition", options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: "bathroom_notes", type: "textarea", label: "Bathroom Notes" },
      { id: "exterior", type: "select", label: "Exterior/Yard Condition", options: ["Excellent", "Good", "Fair", "Poor", "N/A"] },
      { id: "exterior_notes", type: "textarea", label: "Exterior Notes" },
      { id: "general_notes", type: "textarea", label: "General Notes / Damages" },
      { id: "landlord_sig", type: "signature", label: "Landlord / Manager Signature", required: true },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
    ],
  },
  // ── Property Management ──
  {
    id: "management-agreement",
    name: "Property Management Agreement",
    description: "Agreement between property owner and management company for property oversight.",
    category: "property-management",
    icon: "Building2",
    fields: [
      { id: "h1", type: "heading", label: "Property Management Agreement" },
      { id: "p1", type: "paragraph", label: "This agreement is entered into between the Property Owner and the Management Company for the management of the property described below." },
      { id: "owner_name", type: "text", label: "Property Owner Name", required: true },
      { id: "owner_email", type: "email", label: "Owner Email", required: true, width: "half" },
      { id: "owner_phone", type: "phone", label: "Owner Phone", width: "half" },
      { id: "manager_company", type: "text", label: "Management Company Name", required: true, defaultValue: "EC Rental Property Management LLC" },
      { id: "manager_contact", type: "text", label: "Manager Contact Person", required: true },
      { id: "manager_email", type: "email", label: "Manager Email", required: true, width: "half" },
      { id: "manager_phone", type: "phone", label: "Manager Phone", width: "half" },
      { id: "property_address", type: "textarea", label: "Property Address", required: true },
      { id: "property_type", type: "select", label: "Property Type", options: ["Single Family", "Multi-Family", "Condo", "Townhouse", "Commercial"] },
      { id: "start_date", type: "date", label: "Agreement Start Date", required: true, width: "half" },
      { id: "end_date", type: "date", label: "Agreement End Date", required: true, width: "half" },
      { id: "mgmt_fee_percent", type: "number", label: "Management Fee (%)", required: true, width: "half" },
      { id: "leasing_fee", type: "number", label: "Leasing/Placement Fee ($)", width: "half" },
      { id: "services", type: "textarea", label: "Services Included (rent collection, maintenance, etc.)" },
      { id: "emergency_fund", type: "number", label: "Emergency Repair Reserve ($)" },
      { id: "termination_notice", type: "select", label: "Termination Notice Period", options: ["30 days", "60 days", "90 days"] },
      { id: "additional_terms", type: "textarea", label: "Additional Terms" },
      { id: "owner_sig", type: "signature", label: "Property Owner Signature", required: true },
      { id: "manager_sig", type: "signature", label: "Management Company Signature", required: true },
      { id: "sign_date", type: "date", label: "Date Signed", required: true },
    ],
  },
  {
    id: "maintenance-request",
    name: "Maintenance Request Form",
    description: "Tenant maintenance request form for property repairs and issues.",
    category: "property-management",
    icon: "Wrench",
    fields: [
      { id: "h1", type: "heading", label: "Maintenance Request" },
      { id: "tenant_name", type: "text", label: "Tenant Name", required: true },
      { id: "unit_number", type: "text", label: "Unit / Address", required: true },
      { id: "phone", type: "phone", label: "Phone", required: true, width: "half" },
      { id: "email", type: "email", label: "Email", width: "half" },
      { id: "request_date", type: "date", label: "Date of Request", required: true },
      { id: "category", type: "select", label: "Category", options: ["Plumbing", "Electrical", "HVAC", "Appliance", "Pest Control", "Structural", "Other"], required: true },
      { id: "urgency", type: "select", label: "Urgency", options: ["Emergency", "Urgent (24-48 hrs)", "Standard (3-5 days)", "Low priority"], required: true },
      { id: "description", type: "textarea", label: "Describe the Issue", required: true },
      { id: "access", type: "select", label: "Permission to Enter Unit", options: ["Yes, anytime", "Yes, with 24hr notice", "Must be present"], required: true },
      { id: "tenant_sig", type: "signature", label: "Tenant Signature", required: true },
    ],
  },
  // ── General Legal ──
  {
    id: "nda",
    name: "Non-Disclosure Agreement (NDA)",
    description: "Mutual or one-way NDA to protect confidential information between parties.",
    category: "legal",
    icon: "Lock",
    fields: [
      { id: "h1", type: "heading", label: "Non-Disclosure Agreement" },
      { id: "p1", type: "paragraph", label: "This Non-Disclosure Agreement is made between the Disclosing Party and the Receiving Party for the purpose of preventing unauthorized disclosure of confidential information." },
      { id: "nda_type", type: "select", label: "NDA Type", options: ["Mutual (Two-Way)", "One-Way"], required: true },
      { id: "disclosing_party", type: "text", label: "Disclosing Party Name", required: true },
      { id: "disclosing_email", type: "email", label: "Disclosing Party Email", width: "half" },
      { id: "receiving_party", type: "text", label: "Receiving Party Name", required: true },
      { id: "receiving_email", type: "email", label: "Receiving Party Email", width: "half" },
      { id: "effective_date", type: "date", label: "Effective Date", required: true, width: "half" },
      { id: "duration", type: "select", label: "Duration", options: ["1 year", "2 years", "3 years", "5 years", "Indefinite"], required: true, width: "half" },
      { id: "purpose", type: "textarea", label: "Purpose of Disclosure", required: true },
      { id: "confidential_info", type: "textarea", label: "Definition of Confidential Information" },
      { id: "governing_law", type: "text", label: "Governing Law (State/Jurisdiction)" },
      { id: "disclosing_sig", type: "signature", label: "Disclosing Party Signature", required: true },
      { id: "receiving_sig", type: "signature", label: "Receiving Party Signature", required: true },
      { id: "sign_date", type: "date", label: "Date Signed", required: true },
    ],
  },
  {
    id: "general-contract",
    name: "General Service Contract",
    description: "Agreement between a service provider and client outlining terms, scope, and payment.",
    category: "legal",
    icon: "FileSignature",
    fields: [
      { id: "h1", type: "heading", label: "Service Contract Agreement" },
      { id: "client_name", type: "text", label: "Client Name", required: true },
      { id: "client_email", type: "email", label: "Client Email", required: true, width: "half" },
      { id: "client_phone", type: "phone", label: "Client Phone", width: "half" },
      { id: "provider_name", type: "text", label: "Service Provider Name", required: true },
      { id: "provider_email", type: "email", label: "Provider Email", required: true, width: "half" },
      { id: "provider_phone", type: "phone", label: "Provider Phone", width: "half" },
      { id: "service_description", type: "textarea", label: "Description of Services", required: true },
      { id: "start_date", type: "date", label: "Start Date", required: true, width: "half" },
      { id: "end_date", type: "date", label: "End Date", width: "half" },
      { id: "total_fee", type: "number", label: "Total Fee ($)", required: true, width: "half" },
      { id: "payment_schedule", type: "select", label: "Payment Schedule", options: ["Upfront", "50/50", "Monthly", "Upon completion"], width: "half" },
      { id: "late_payment", type: "textarea", label: "Late Payment Terms" },
      { id: "termination", type: "textarea", label: "Termination Clause" },
      { id: "governing_law", type: "text", label: "Governing Law (State)" },
      { id: "client_sig", type: "signature", label: "Client Signature", required: true },
      { id: "provider_sig", type: "signature", label: "Provider Signature", required: true },
      { id: "sign_date", type: "date", label: "Date Signed", required: true },
    ],
  },
  {
    id: "liability-waiver",
    name: "Liability Waiver & Release",
    description: "General waiver of liability and release of claims for activities or services.",
    category: "legal",
    icon: "ShieldAlert",
    fields: [
      { id: "h1", type: "heading", label: "Liability Waiver & Release of Claims" },
      { id: "p1", type: "paragraph", label: "By signing this form, the participant acknowledges and accepts all risks associated with the activity described below." },
      { id: "participant_name", type: "text", label: "Participant Full Name", required: true },
      { id: "dob", type: "date", label: "Date of Birth", width: "half" },
      { id: "phone", type: "phone", label: "Phone", width: "half" },
      { id: "email", type: "email", label: "Email", required: true },
      { id: "emergency_contact", type: "text", label: "Emergency Contact Name", required: true },
      { id: "emergency_phone", type: "phone", label: "Emergency Contact Phone", required: true },
      { id: "activity", type: "textarea", label: "Activity / Event Description", required: true },
      { id: "organization", type: "text", label: "Organization / Company Name", required: true },
      { id: "event_date", type: "date", label: "Date of Activity", required: true },
      { id: "medical_conditions", type: "textarea", label: "Known Medical Conditions" },
      { id: "agree_waiver", type: "checkbox", label: "I voluntarily agree to assume all risks and release the organization from any liability." },
      { id: "participant_sig", type: "signature", label: "Participant Signature", required: true },
      { id: "sign_date", type: "date", label: "Date", required: true },
    ],
  },
];
