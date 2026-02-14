import { TaskEvidence } from "@/types";

export const taskEvidence: TaskEvidence[] = [
  // === MONDAY (6 completed) ===
  {
    taskId: "mon-1",
    type: "spreadsheet",
    title: "Research spreadsheet with 5 listings analyzed",
    previewData: {
      headers: ["Listing", "Price/Night", "Rating", "Amenities", "Location"],
      rows: [
        ["Sunny Loft Centro", "€89", "4.9★", "WiFi, AC, Pool", "Centro"],
        ["Beach Studio Mála", "€65", "4.7★", "WiFi, Terrace", "Malagueta"],
        ["Modern Apt Soho", "€102", "4.8★", "WiFi, AC, Gym", "Soho"],
        ["Cozy Room Lagunillas", "€45", "4.6★", "WiFi, Kitchen", "Lagunillas"],
      ],
    },
  },
  {
    taskId: "mon-2",
    type: "infographic",
    title: "Infographic: Málaga visitor profile",
    previewData: {
      stats: [
        { label: "UK", value: 28 },
        { label: "DE", value: 22 },
        { label: "FR", value: 18 },
        { label: "NL", value: 14 },
      ],
      headline: "14M visitors/year",
      subline: "Avg stay: 4.2 nights",
    },
  },
  {
    taskId: "mon-3",
    type: "spreadsheet",
    title: "Price comparison chart + analysis",
    previewData: {
      headers: ["Property Type", "Low Season", "High Season", "Avg Occupancy"],
      rows: [
        ["Studio", "€45", "€85", "62%"],
        ["1-Bed Apt", "€65", "€120", "71%"],
        ["2-Bed Apt", "€90", "€180", "68%"],
        ["Villa", "€150", "€320", "55%"],
      ],
    },
  },
  {
    taskId: "mon-4",
    type: "document",
    title: "Legal requirements checklist",
    previewData: {
      docTitle: "VFT Regulations — Andalucía",
      lines: [
        "Registration with Junta de Andalucía",
        "Tourist registry (Parte de Viajero)",
        "Safety: fire extinguisher, first aid kit",
        "Energy certificate (Certificado Energético)",
      ],
    },
  },
  {
    taskId: "mon-5",
    type: "document",
    title: "Concept canvas (1 page)",
    previewData: {
      docTitle: "Airbnb Concept Canvas",
      lines: [
        "Name: Casa Limón Málaga",
        "USP: Rooftop terrace + local food guide",
        "Target: Young couples, 25-35",
        "Price point: €75-95/night",
      ],
    },
  },
  {
    taskId: "mon-6",
    type: "document",
    title: "Journal entry in portfolio",
    previewData: {
      docTitle: "Day 1 Reflection — Lucas",
      lines: [
        "Today I learned that the Airbnb market in",
        "Málaga is much more competitive than I thought.",
        "The pricing varies a lot by neighborhood and",
        "season — I was surprised by the 40% difference.",
      ],
    },
  },

  // === TUESDAY (6 completed) ===
  {
    taskId: "tue-1",
    type: "floor_plan",
    title: "Floor plan sketch (digital)",
    previewData: {
      rooms: [
        { name: "Living", x: 0, y: 0, w: 60, h: 40, color: "#d4e6f1" },
        { name: "Bedroom", x: 60, y: 0, w: 40, h: 40, color: "#d5f5e3" },
        { name: "Kitchen", x: 0, y: 40, w: 35, h: 30, color: "#fdebd0" },
        { name: "Bath", x: 35, y: 40, w: 25, h: 30, color: "#e8daef" },
        { name: "Terrace", x: 60, y: 40, w: 40, h: 30, color: "#fef9e7" },
      ],
    },
  },
  {
    taskId: "tue-2",
    type: "spreadsheet",
    title: "Budget spreadsheet with categories",
    previewData: {
      headers: ["Category", "Item", "Cost", "Priority"],
      rows: [
        ["Furniture", "Sofa bed", "€420", "High"],
        ["Decor", "Wall art + plants", "€180", "Medium"],
        ["Legal", "VFT Registration", "€150", "High"],
        ["Photo", "Professional shoot", "€200", "High"],
      ],
    },
  },
  {
    taskId: "tue-3",
    type: "brand_board",
    title: "Brand board: Casa Limón",
    previewData: {
      brandName: "Casa Limón",
      tagline: "Your sunny escape in Málaga",
      colors: ["#F4D03F", "#2E86C1", "#F5F5F5"],
      logoShape: "circle",
    },
  },
  {
    taskId: "tue-4",
    type: "diagram",
    title: "Customer journey map",
    previewData: {
      steps: [
        { label: "Discover", icon: "search" },
        { label: "Book", icon: "calendar" },
        { label: "Arrive", icon: "plane" },
        { label: "Stay", icon: "home" },
        { label: "Review", icon: "star" },
      ],
    },
  },
  {
    taskId: "tue-5",
    type: "document",
    title: "Listing description (500+ words)",
    previewData: {
      docTitle: "Casa Limón — Airbnb Listing",
      lines: [
        "Welcome to Casa Limón, a sun-drenched",
        "apartment in the heart of Málaga's vibrant",
        "Soho district. With a private rooftop terrace",
        "and handpicked local experience guide.",
      ],
    },
  },
  {
    taskId: "tue-6",
    type: "document",
    title: "Peer review rubric (completed)",
    previewData: {
      docTitle: "Peer Review — Sofía → Lucas",
      lines: [
        "Clarity: 9/10 — Very engaging opening",
        "Detail: 8/10 — Add more about neighborhood",
        "Grammar: 10/10 — No errors found",
        "Overall: Strong listing, ready to publish!",
      ],
    },
  },

  // === WEDNESDAY (2 completed) ===
  {
    taskId: "wed-1",
    type: "landing_page",
    title: "Landing page live link",
    previewData: {
      url: "casalimon.qhuma.dev",
      heroGradient: ["#F4D03F", "#2E86C1"],
      sections: ["Hero", "Features", "Gallery", "Location", "Book Now"],
    },
  },
  {
    taskId: "wed-2",
    type: "landing_page",
    title: "Landing page with complete content",
    previewData: {
      url: "casalimon.qhuma.dev",
      heroGradient: ["#F4D03F", "#2E86C1"],
      sections: ["Hero + Copy", "Amenities", "Reviews", "Map", "CTA"],
    },
  },
];
