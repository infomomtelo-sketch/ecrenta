export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  description?: string;
  status: "not_inspected" | "pass" | "fail" | "na";
  notes: string;
  severity?: "minor" | "moderate" | "major" | "critical";
}

export interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: Omit<ChecklistItem, "status" | "notes" | "severity">[];
}

export const INSPECTION_TEMPLATES: InspectionTemplate[] = [
  {
    id: "ca_habitability",
    name: "CA Habitability Standards",
    description: "California Civil Code §1941.1 — minimum habitability requirements for rental properties",
    icon: "🏠",
    items: [
      { id: "ca1", category: "Plumbing", item: "Hot and cold running water supplied to appropriate fixtures" },
      { id: "ca2", category: "Plumbing", item: "Sewage disposal system in good working order" },
      { id: "ca3", category: "Plumbing", item: "No leaks in pipes, faucets, or fixtures" },
      { id: "ca4", category: "Heating", item: "Heating facilities in good working order" },
      { id: "ca5", category: "Heating", item: "Adequate heat to all habitable rooms" },
      { id: "ca6", category: "Electrical", item: "Electrical lighting and wiring in good working order" },
      { id: "ca7", category: "Electrical", item: "GFCI outlets in kitchens and bathrooms" },
      { id: "ca8", category: "Electrical", item: "All light switches and outlets functional" },
      { id: "ca9", category: "Structure", item: "Building and grounds clean, sanitary, free from debris" },
      { id: "ca10", category: "Structure", item: "Floors, stairways, and railings in good repair" },
      { id: "ca11", category: "Structure", item: "Roof, walls, windows waterproof and weather-protected" },
      { id: "ca12", category: "Structure", item: "No broken windows or doors" },
      { id: "ca13", category: "Structure", item: "All doors and windows have functioning locks" },
      { id: "ca14", category: "Safety", item: "Smoke detectors installed and functional (per CA law)" },
      { id: "ca15", category: "Safety", item: "Carbon monoxide detectors installed (per CA law)" },
      { id: "ca16", category: "Safety", item: "Fire extinguisher accessible (if multi-unit)" },
      { id: "ca17", category: "Safety", item: "Adequate number of trash receptacles" },
      { id: "ca18", category: "Pest Control", item: "No evidence of rodent or insect infestation" },
      { id: "ca19", category: "Pest Control", item: "No evidence of mold or mildew" },
      { id: "ca20", category: "Ventilation", item: "Adequate ventilation in all rooms" },
      { id: "ca21", category: "Ventilation", item: "Working exhaust fans in bathrooms" },
      { id: "ca22", category: "Lead Paint", item: "Lead paint disclosure provided (pre-1978 buildings)" },
    ],
  },
  {
    id: "nspire",
    name: "NSPIRE Standards",
    description: "HUD's National Standards for the Physical Inspection of Real Estate — federal inspection protocol",
    icon: "🏛️",
    items: [
      { id: "ns1", category: "Unit - Bathroom", item: "Bathroom ceiling in acceptable condition" },
      { id: "ns2", category: "Unit - Bathroom", item: "Bathroom floor covering intact" },
      { id: "ns3", category: "Unit - Bathroom", item: "Toilet functioning properly" },
      { id: "ns4", category: "Unit - Bathroom", item: "Lavatory (sink) functioning and draining" },
      { id: "ns5", category: "Unit - Bathroom", item: "Tub/shower functioning, no leaks, caulking intact" },
      { id: "ns6", category: "Unit - Bathroom", item: "Ventilation present (fan or window)" },
      { id: "ns7", category: "Unit - Kitchen", item: "Stove/oven functioning on all burners" },
      { id: "ns8", category: "Unit - Kitchen", item: "Refrigerator maintaining proper temperature" },
      { id: "ns9", category: "Unit - Kitchen", item: "Kitchen sink functioning and draining" },
      { id: "ns10", category: "Unit - Kitchen", item: "Countertops and cabinets in acceptable condition" },
      { id: "ns11", category: "Unit - Kitchen", item: "No evidence of grease or food buildup" },
      { id: "ns12", category: "Unit - Living Areas", item: "Walls free of holes, cracks, peeling paint" },
      { id: "ns13", category: "Unit - Living Areas", item: "Ceiling in acceptable condition" },
      { id: "ns14", category: "Unit - Living Areas", item: "Floor covering intact, no trip hazards" },
      { id: "ns15", category: "Unit - Living Areas", item: "Windows operable, no broken glass" },
      { id: "ns16", category: "Unit - Living Areas", item: "Window screens present and intact" },
      { id: "ns17", category: "Unit - Living Areas", item: "Doors functioning properly with hardware" },
      { id: "ns18", category: "Unit - Safety", item: "Smoke detectors present and functional" },
      { id: "ns19", category: "Unit - Safety", item: "Carbon monoxide detectors present" },
      { id: "ns20", category: "Unit - Safety", item: "Electrical outlets and switches safe" },
      { id: "ns21", category: "Unit - Safety", item: "No exposed wiring" },
      { id: "ns22", category: "Unit - Safety", item: "HVAC system functioning" },
      { id: "ns23", category: "Building Exterior", item: "Foundation walls intact" },
      { id: "ns24", category: "Building Exterior", item: "Roof in acceptable condition" },
      { id: "ns25", category: "Building Exterior", item: "Gutters and downspouts attached and functional" },
      { id: "ns26", category: "Building Exterior", item: "Stairs and railings secure" },
      { id: "ns27", category: "Building Exterior", item: "Exterior paint not peeling" },
      { id: "ns28", category: "Common Areas", item: "Hallways clean and well-lit" },
      { id: "ns29", category: "Common Areas", item: "Exit signs illuminated" },
      { id: "ns30", category: "Common Areas", item: "Fire extinguishers charged and accessible" },
      { id: "ns31", category: "Site", item: "Grounds maintained, no debris" },
      { id: "ns32", category: "Site", item: "Parking lot in acceptable condition" },
      { id: "ns33", category: "Site", item: "Playground equipment safe (if applicable)" },
    ],
  },
  {
    id: "move_in_out",
    name: "Move-In / Move-Out",
    description: "Standard room-by-room checklist for documenting property condition at tenant transitions",
    icon: "📋",
    items: [
      { id: "mio1", category: "Entryway", item: "Front door condition and locks" },
      { id: "mio2", category: "Entryway", item: "Doorbell functioning" },
      { id: "mio3", category: "Entryway", item: "Entry flooring condition" },
      { id: "mio4", category: "Living Room", item: "Walls — marks, holes, damage" },
      { id: "mio5", category: "Living Room", item: "Carpet/flooring condition" },
      { id: "mio6", category: "Living Room", item: "Light fixtures and switches" },
      { id: "mio7", category: "Living Room", item: "Windows and blinds condition" },
      { id: "mio8", category: "Kitchen", item: "Countertops — chips, stains, damage" },
      { id: "mio9", category: "Kitchen", item: "Sink and faucet condition" },
      { id: "mio10", category: "Kitchen", item: "Stove/oven — clean, functional" },
      { id: "mio11", category: "Kitchen", item: "Refrigerator — clean, functional" },
      { id: "mio12", category: "Kitchen", item: "Dishwasher — clean, functional" },
      { id: "mio13", category: "Kitchen", item: "Cabinets and drawers condition" },
      { id: "mio14", category: "Kitchen", item: "Flooring condition" },
      { id: "mio15", category: "Bedroom 1", item: "Walls — marks, holes, damage" },
      { id: "mio16", category: "Bedroom 1", item: "Closet doors and shelving" },
      { id: "mio17", category: "Bedroom 1", item: "Carpet/flooring condition" },
      { id: "mio18", category: "Bedroom 1", item: "Windows, blinds, and screens" },
      { id: "mio19", category: "Bedroom 2", item: "Walls — marks, holes, damage" },
      { id: "mio20", category: "Bedroom 2", item: "Closet doors and shelving" },
      { id: "mio21", category: "Bedroom 2", item: "Carpet/flooring condition" },
      { id: "mio22", category: "Bathroom 1", item: "Toilet condition and function" },
      { id: "mio23", category: "Bathroom 1", item: "Sink and faucet condition" },
      { id: "mio24", category: "Bathroom 1", item: "Tub/shower condition, caulking" },
      { id: "mio25", category: "Bathroom 1", item: "Mirror and medicine cabinet" },
      { id: "mio26", category: "Bathroom 1", item: "Tile and grout condition" },
      { id: "mio27", category: "Bathroom 1", item: "Exhaust fan functional" },
      { id: "mio28", category: "Garage/Storage", item: "Garage door opener functional" },
      { id: "mio29", category: "Garage/Storage", item: "Floor condition" },
      { id: "mio30", category: "Exterior", item: "Patio/deck condition" },
      { id: "mio31", category: "Exterior", item: "Landscaping and yard condition" },
      { id: "mio32", category: "Exterior", item: "Fencing and gates" },
      { id: "mio33", category: "General", item: "All keys returned / provided" },
      { id: "mio34", category: "General", item: "Garage door openers returned / provided" },
      { id: "mio35", category: "General", item: "Overall cleanliness" },
    ],
  },
  {
    id: "annual_routine",
    name: "Annual / Routine",
    description: "Preventive maintenance inspection to catch issues early and protect property value",
    icon: "🔧",
    items: [
      { id: "ar1", category: "HVAC", item: "Air filter condition (replace if dirty)" },
      { id: "ar2", category: "HVAC", item: "Thermostat functioning correctly" },
      { id: "ar3", category: "HVAC", item: "Vents and registers clean and unblocked" },
      { id: "ar4", category: "HVAC", item: "A/C or furnace operational" },
      { id: "ar5", category: "Plumbing", item: "Check under sinks for leaks" },
      { id: "ar6", category: "Plumbing", item: "Water heater condition and temperature" },
      { id: "ar7", category: "Plumbing", item: "Toilet operation (no running/leaking)" },
      { id: "ar8", category: "Plumbing", item: "Caulking around tubs and showers" },
      { id: "ar9", category: "Electrical", item: "Test all GFCI outlets" },
      { id: "ar10", category: "Electrical", item: "Check for overloaded circuits / extension cords" },
      { id: "ar11", category: "Electrical", item: "Exterior lighting functional" },
      { id: "ar12", category: "Safety", item: "Smoke detector batteries and function" },
      { id: "ar13", category: "Safety", item: "CO detector batteries and function" },
      { id: "ar14", category: "Safety", item: "Fire extinguisher charge level" },
      { id: "ar15", category: "Exterior", item: "Roof visible damage or wear" },
      { id: "ar16", category: "Exterior", item: "Gutter and downspout condition" },
      { id: "ar17", category: "Exterior", item: "Foundation visible cracks" },
      { id: "ar18", category: "Exterior", item: "Siding / exterior paint condition" },
      { id: "ar19", category: "Exterior", item: "Landscaping drainage (grading away from building)" },
      { id: "ar20", category: "Interior", item: "Check for signs of water damage" },
      { id: "ar21", category: "Interior", item: "Check for mold or mildew" },
      { id: "ar22", category: "Interior", item: "Pest activity evidence" },
      { id: "ar23", category: "Interior", item: "Window and door seals / weatherstripping" },
      { id: "ar24", category: "Appliances", item: "Washer and dryer hoses" },
      { id: "ar25", category: "Appliances", item: "Dishwasher drain and hose" },
      { id: "ar26", category: "Appliances", item: "Garbage disposal function" },
    ],
  },
];

export function createChecklistFromTemplate(templateId: string): ChecklistItem[] {
  const template = INSPECTION_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return [];
  return template.items.map((item) => ({
    ...item,
    status: "not_inspected" as const,
    notes: "",
  }));
}
