import { CompetencyKey } from "@/types";

export interface GeneratedTask {
  id: string;
  time: string;
  title: string;
  description: string;
  subject: string;
  competencies: CompetencyKey[];
  evidence: string;
  xpReward: number;
}

export interface WeeklyBreakdown {
  week: number;
  phase: string;
  taskCount: number;
}

export interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalTasks: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  competencies: CompetencyKey[];
  highlights: string[];
  weeklyBreakdown: WeeklyBreakdown[];
  sampleTasks: GeneratedTask[];
}

export interface SourceAnalysis {
  source: string;
  topics: string[];
  learningObjectives: string[];
}

export const mockSourceAnalysis: SourceAnalysis = {
  source: "Cambridge IGCSE Business Studies (0450)",
  topics: [
    "The marketing mix (4Ps)",
    "Market research methods",
    "Branding and brand identity",
    "Pricing strategies",
    "Promotion and advertising",
    "Product lifecycle",
    "Target market segmentation",
    "E-commerce and digital marketing",
  ],
  learningObjectives: [
    "Understand the role of marketing in business",
    "Analyze different pricing strategies and their impact",
    "Evaluate the effectiveness of promotional methods",
    "Apply market research techniques to real-world scenarios",
    "Design a coherent marketing mix for a product or service",
    "Assess the importance of branding in competitive markets",
  ],
};

export const mockGeneratedProjects: GeneratedProject[] = [
  {
    id: "gen-1",
    name: "Launch a Sustainable Brand",
    description:
      "Students create an eco-friendly brand from scratch — defining the product, target audience, pricing strategy, and a full social media campaign. The project culminates in a live pitch to classmates acting as potential investors, where teams must defend their marketing decisions with real data.",
    duration: "2 weeks",
    totalTasks: 14,
    difficulty: "Intermediate",
    competencies: ["CE", "CLC", "CD", "CCEC", "CPSAA", "CC"],
    highlights: [
      "Real-world brand creation with sustainability focus",
      "Social media campaign design and analytics",
      "Live investor pitch with Q&A defense",
    ],
    weeklyBreakdown: [
      { week: 1, phase: "Research & Brand Development", taskCount: 7 },
      { week: 2, phase: "Campaign Launch & Pitch", taskCount: 7 },
    ],
    sampleTasks: [
      {
        id: "gen1-t1",
        time: "8:30 – 9:30",
        title: "Market Gap Analysis: Find Your Sustainable Niche",
        description:
          "Research existing eco-friendly brands in your chosen category. Identify gaps in the market — what's missing? What do consumers want but can't find? Use online surveys and competitor analysis to validate your findings.",
        subject: "Business Studies + Technology",
        competencies: ["CE", "CD"],
        evidence: "Market gap analysis report with competitor matrix",
        xpReward: 55,
      },
      {
        id: "gen1-t2",
        time: "9:30 – 10:30",
        title: "Define Your Target Audience: Persona Creation",
        description:
          "Create 2 detailed buyer personas for your sustainable brand. Include demographics, psychographics, buying habits, media consumption, and pain points. Use real data from market research to support your choices.",
        subject: "Social Studies + Marketing",
        competencies: ["CPSAA", "CE"],
        evidence: "2 buyer persona cards with supporting data",
        xpReward: 45,
      },
      {
        id: "gen1-t3",
        time: "11:00 – 12:00",
        title: "Brand Identity Workshop: Name, Values & Visual Language",
        description:
          "Define your brand's core values, mission statement, and unique selling proposition. Choose a name, design a logo concept, and select a color palette that communicates sustainability and quality.",
        subject: "Visual Arts + Business",
        competencies: ["CCEC", "CE"],
        evidence: "Brand identity board (name, logo, colors, mission)",
        xpReward: 50,
      },
      {
        id: "gen1-t4",
        time: "12:00 – 13:00",
        title: "Pricing Strategy: Cost-Plus vs Value-Based",
        description:
          "Calculate production costs for your product. Compare cost-plus pricing with value-based pricing. Determine your final price point and justify it with market data. Model profit margins at 3 different volumes.",
        subject: "Mathematics + Business",
        competencies: ["STEM", "CE"],
        evidence: "Pricing model spreadsheet with 3 scenarios",
        xpReward: 60,
      },
      {
        id: "gen1-t5",
        time: "8:30 – 9:30",
        title: "Social Media Campaign: Content Calendar Design",
        description:
          "Plan a 2-week social media campaign across Instagram and TikTok. Create a content calendar with post types (carousel, reel, story), captions, hashtags, and posting schedule. Focus on storytelling.",
        subject: "Language Arts + Technology",
        competencies: ["CLC", "CD"],
        evidence: "Content calendar + 3 sample posts designed",
        xpReward: 55,
      },
      {
        id: "gen1-t6",
        time: "9:30 – 10:30",
        title: "Design Campaign Visuals: Canva or Figma",
        description:
          "Create the visual assets for your social media campaign — 3 Instagram posts, 2 stories, and 1 reel storyboard. Maintain brand consistency across all materials.",
        subject: "Visual Arts + Technology",
        competencies: ["CCEC", "CD"],
        evidence: "5 campaign visuals + 1 reel storyboard",
        xpReward: 50,
      },
      {
        id: "gen1-t7",
        time: "11:00 – 12:00",
        title: "Investor Pitch: Build Your 5-Slide Deck",
        description:
          "Prepare your final pitch: Problem, Solution, Market Opportunity, Marketing Strategy, Financial Projections. Practice delivering in under 4 minutes. Focus on data-backed arguments.",
        subject: "Cross-Curricular",
        competencies: ["CLC", "CE", "CPSAA"],
        evidence: "Pitch deck + practice recording",
        xpReward: 70,
      },
      {
        id: "gen1-t8",
        time: "12:00 – 13:00",
        title: "Pitch Day: Present & Defend Your Brand",
        description:
          "Present your sustainable brand to the class. Classmates act as investors asking tough questions about your marketing mix, pricing, and growth strategy. Defend your decisions with evidence.",
        subject: "Cross-Curricular Evaluation",
        competencies: ["CLC", "CE", "CC", "CPSAA"],
        evidence: "Pitch recording + peer evaluation forms",
        xpReward: 80,
      },
    ],
  },
  {
    id: "gen-2",
    name: "Pop-Up Market Day",
    description:
      "Teams plan and simulate a real pop-up market in the school. Each team develops a product, sets prices based on cost analysis, designs marketing materials, handles logistics, and runs the stall. After the event, students analyze sales data, customer feedback, and calculate actual profit/loss.",
    duration: "3 weeks",
    totalTasks: 18,
    difficulty: "Advanced",
    competencies: ["CE", "STEM", "CLC", "CD", "CPSAA", "CC", "CCEC"],
    highlights: [
      "Real product development with physical sales experience",
      "Full financial cycle: budget → sales → profit analysis",
      "Customer interaction and live market research",
    ],
    weeklyBreakdown: [
      { week: 1, phase: "Product Development & Planning", taskCount: 6 },
      { week: 2, phase: "Marketing & Logistics", taskCount: 6 },
      { week: 3, phase: "Market Day & Post-Analysis", taskCount: 6 },
    ],
    sampleTasks: [
      {
        id: "gen2-t1",
        time: "8:30 – 9:30",
        title: "Product Brainstorm: What Will You Sell?",
        description:
          "Brainstorm 5 product ideas suitable for a school market. Evaluate each on: cost to produce, appeal to target market, feasibility, and profit potential. Select your top choice with justification.",
        subject: "Business Studies + Design",
        competencies: ["CE", "CPSAA"],
        evidence: "Product evaluation matrix + final choice rationale",
        xpReward: 45,
      },
      {
        id: "gen2-t2",
        time: "9:30 – 10:30",
        title: "Cost Analysis: Calculate Your Break-Even Point",
        description:
          "List all costs: materials, packaging, setup, signage. Calculate cost per unit, set your selling price, and determine how many units you need to sell to break even. Model best/worst case scenarios.",
        subject: "Mathematics + Business",
        competencies: ["STEM", "CE"],
        evidence: "Break-even analysis spreadsheet",
        xpReward: 60,
      },
      {
        id: "gen2-t3",
        time: "11:00 – 12:00",
        title: "Market Research: Survey Your Schoolmates",
        description:
          "Design a 10-question survey about buying preferences, price sensitivity, and product interest. Distribute to at least 30 students. Analyze results and adjust your product/pricing based on findings.",
        subject: "Mathematics + Social Studies",
        competencies: ["STEM", "CC"],
        evidence: "Survey results + analysis infographic",
        xpReward: 55,
      },
      {
        id: "gen2-t4",
        time: "8:30 – 9:30",
        title: "Design Your Stall: Layout, Signage & Branding",
        description:
          "Plan your market stall layout for maximum customer flow. Design a banner, price tags, and product labels. Consider visual merchandising principles to make your stall stand out.",
        subject: "Visual Arts + Business",
        competencies: ["CCEC", "CE"],
        evidence: "Stall layout plan + signage designs",
        xpReward: 50,
      },
      {
        id: "gen2-t5",
        time: "9:30 – 10:30",
        title: "Promotional Campaign: Flyers, Posters & Announcements",
        description:
          "Create promotional materials for Market Day. Design a poster, write an announcement script for school PA, and create social media posts. Coordinate with school admin for distribution.",
        subject: "Language Arts + Visual Arts",
        competencies: ["CLC", "CCEC", "CD"],
        evidence: "Poster + PA script + 2 social media posts",
        xpReward: 50,
      },
      {
        id: "gen2-t6",
        time: "11:00 – 13:00",
        title: "MARKET DAY: Run Your Stall",
        description:
          "Set up your stall, manage inventory, handle cash transactions, engage customers, and track every sale. Take photos and collect customer feedback forms. This is the real deal!",
        subject: "Cross-Curricular Experience",
        competencies: ["CE", "CLC", "CPSAA", "CC"],
        evidence: "Sales log + customer feedback forms + photos",
        xpReward: 90,
      },
      {
        id: "gen2-t7",
        time: "8:30 – 9:30",
        title: "Post-Market Analysis: Revenue, Costs & Profit",
        description:
          "Calculate your total revenue, subtract all costs, and determine your actual profit or loss. Compare with your predictions. What went right? What would you change?",
        subject: "Mathematics + Business",
        competencies: ["STEM", "CE"],
        evidence: "Profit/loss statement + variance analysis",
        xpReward: 65,
      },
      {
        id: "gen2-t8",
        time: "9:30 – 10:30",
        title: "Customer Feedback Analysis & Reflection",
        description:
          "Compile and analyze customer feedback. Identify patterns in what customers liked and disliked. Write a 300-word reflection on what you learned about marketing, pricing, and customer behavior.",
        subject: "Language Arts + Business",
        competencies: ["CLC", "CPSAA"],
        evidence: "Feedback analysis + reflection essay",
        xpReward: 50,
      },
    ],
  },
  {
    id: "gen-3",
    name: "Redesign a Failing Product",
    description:
      "Students choose a real product that has struggled in the market (e.g., a discontinued item or a brand with declining sales). They conduct a deep analysis of what went wrong — poor positioning, bad pricing, weak branding — then propose a complete marketing relaunch with new strategy, visuals, and a go-to-market plan.",
    duration: "2 weeks",
    totalTasks: 12,
    difficulty: "Advanced",
    competencies: ["CE", "CLC", "CD", "STEM", "CPSAA", "CC", "CCEC"],
    highlights: [
      "Real-world case study analysis of market failures",
      "Strategic repositioning with data-backed decisions",
      "Complete rebranding and go-to-market presentation",
    ],
    weeklyBreakdown: [
      { week: 1, phase: "Failure Analysis & Research", taskCount: 6 },
      { week: 2, phase: "Relaunch Strategy & Presentation", taskCount: 6 },
    ],
    sampleTasks: [
      {
        id: "gen3-t1",
        time: "8:30 – 9:30",
        title: "Choose Your Failing Product: Research & Selection",
        description:
          "Research 3 products that have failed or are struggling in the market. Analyze initial sales data, media coverage, and consumer reviews. Select one product and write a brief justification for your choice.",
        subject: "Business Studies + Technology",
        competencies: ["CE", "CD"],
        evidence: "Product selection report with 3 candidates analyzed",
        xpReward: 50,
      },
      {
        id: "gen3-t2",
        time: "9:30 – 10:30",
        title: "Failure Autopsy: What Went Wrong?",
        description:
          "Conduct a detailed analysis of why the product failed. Examine the original marketing mix (4Ps), identify specific mistakes in positioning, pricing, distribution, or promotion. Use the SWOT framework.",
        subject: "Business Studies",
        competencies: ["CE", "CPSAA"],
        evidence: "SWOT analysis + failure diagnosis report",
        xpReward: 60,
      },
      {
        id: "gen3-t3",
        time: "11:00 – 12:00",
        title: "Consumer Research: What Would Make You Buy It?",
        description:
          "Design and conduct a survey targeting your age group. Ask about brand perception, willingness to pay, desired features, and preferred marketing channels. Minimum 25 responses.",
        subject: "Mathematics + Social Studies",
        competencies: ["STEM", "CC"],
        evidence: "Survey results with statistical analysis",
        xpReward: 55,
      },
      {
        id: "gen3-t4",
        time: "12:00 – 13:00",
        title: "Competitive Landscape: Who Does It Better?",
        description:
          "Identify 3 successful competitors and analyze what they do differently. Create a competitive comparison matrix covering price, features, branding, distribution, and customer satisfaction.",
        subject: "Business Studies + Technology",
        competencies: ["CE", "CD"],
        evidence: "Competitive analysis matrix + positioning map",
        xpReward: 50,
      },
      {
        id: "gen3-t5",
        time: "8:30 – 9:30",
        title: "Rebrand & Reposition: New Identity Design",
        description:
          "Design a new brand identity for the product — updated name (if needed), logo, packaging, and visual language. Create a mood board and explain how each element addresses the original failures.",
        subject: "Visual Arts + Business",
        competencies: ["CCEC", "CE"],
        evidence: "Rebrand mood board + new logo/packaging concepts",
        xpReward: 55,
      },
      {
        id: "gen3-t6",
        time: "9:30 – 10:30",
        title: "New Pricing & Distribution Strategy",
        description:
          "Develop a new pricing strategy based on your consumer research. Define distribution channels (online, retail, DTC). Calculate projected margins and create a 6-month sales forecast.",
        subject: "Mathematics + Business",
        competencies: ["STEM", "CE"],
        evidence: "Pricing model + distribution plan + sales forecast",
        xpReward: 65,
      },
      {
        id: "gen3-t7",
        time: "11:00 – 12:00",
        title: "Go-to-Market Campaign: Digital Strategy",
        description:
          "Design a digital marketing campaign for the relaunch. Include social media strategy, influencer partnerships, launch timeline, and KPIs. Create 3 sample ad concepts.",
        subject: "Language Arts + Technology",
        competencies: ["CLC", "CD"],
        evidence: "Campaign brief + 3 ad mockups + KPI dashboard",
        xpReward: 60,
      },
      {
        id: "gen3-t8",
        time: "12:00 – 13:00",
        title: "Relaunch Presentation: Pitch Your Strategy",
        description:
          "Present your complete relaunch strategy to the class. Cover: what failed, why, your research findings, new strategy, and projected outcomes. Class votes on 'Most Convincing Turnaround'.",
        subject: "Cross-Curricular Evaluation",
        competencies: ["CLC", "CE", "CC", "CPSAA"],
        evidence: "Presentation recording + peer evaluations",
        xpReward: 80,
      },
    ],
  },
];
